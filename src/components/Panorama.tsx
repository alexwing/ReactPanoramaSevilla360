import React, { useState, useEffect, useMemo, memo, useRef, useImperativeHandle } from "react";
import ReactPannellum from "react-pannellum";
import { PanoramaMultiRes } from "../models/Interfaces";
import axios from "axios";

interface PanoramaProps {
  id: string;
  multiResScene: PanoramaMultiRes;
  cameraState?: {
    yaw?: number;
    pitch?: number;
    hfov?: number;
  } | null;
  // Callback para exponer la instancia del viewer cuando esté lista
  onViewerReady?: (viewer: any | null) => void;
  // Notificar cuando la cámara haya sido aplicada con éxito (para que el padre pueda limpiar estado)
  onCameraApplied?: () => void;
}
export type PanoramaHandle = {
  getCamera: () => { yaw?: number; pitch?: number; hfov?: number } | null;
}

const PanoramaInner = ({ id, multiResScene, cameraState = null, onViewerReady, onCameraApplied }: PanoramaProps, ref: React.Ref<PanoramaHandle>) => {
  const [hotspots, setHotspots] = useState<any[] | null>(null);
  const internalViewerRef = useRef<any | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    axios
      .get("./hotspots.json")
      .then((response) => {
        const hotspotsWithUniqueIds = response.data.map((hotspot: any) => ({
          ...hotspot,
          id: `${multiResScene.id}_${hotspot.id}`,
        }));
        setHotspots(hotspotsWithUniqueIds);
      })
      .catch((error) => {
        console.log("Error al leer el archivo JSON.", error);
      });
  }, []);

  // FIX panellum bug: Oculta el primer contenedor .pnlm-render-container solo si hay al menos dos
  // Usamos MutationObserver para detectar nodos añadidos por la librería.
  useEffect(() => {
    const modified = new WeakMap<HTMLElement, string>();

    const hideFirstIfNeeded = () => {
      const elems = document.querySelectorAll('.pnlm-render-container');
      // Solo actuar si hay 2 o más contenedores (comportamiento duplicado de la librería)
      if (elems && elems.length >= 2) {
        const first = elems[0] as HTMLElement | undefined;
        if (first && !modified.has(first)) {
          // Guardar display previo y ocultar
          modified.set(first, first.style.display || '');
          first.style.display = 'none';
        }
      }
    };

    // Intento inmediato por si ya están en el DOM
    try {
      hideFirstIfNeeded();
    } catch (err) {
      // ignorar
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length > 0) {
          // Intentar ocultar si se añadieron nodos
          hideFirstIfNeeded();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      // Restaurar estilos modificados: seleccionamos los contenedores actuales
      try {
        const elems = document.querySelectorAll('.pnlm-render-container');
        elems.forEach((el) => {
          const elh = el as HTMLElement;
          const prev = modified.get(elh);
          if (typeof prev === 'string') elh.style.display = prev;
        });
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const config = useMemo(
    () => ({
  autoLoad: true,
  showControls: false,
  showFullscreenCtrl: false,
  // Restaurar pitch/yaw/hfov si se recibió cameraState
  yaw: cameraState?.yaw ?? 0,
  pitch: cameraState?.pitch ?? -5,
  hfov: cameraState?.hfov ?? 80,
      debugger: true,
      haov: 200,
      vaov: 110,
      vOffset: 0,
      maxHfov: 120,
      minHfov: 20,
      compass: true,
      hotSpots: hotspots,
    }),
    [hotspots, cameraState]
  );

  // Intentar obtener la instancia del viewer pannellum y notificar via callback
  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;

    const tryGetViewer = () => {
      try {
        // Intento A: vía API del propio react-pannellum
        let viewer: any = undefined;
        try {
          const rpAny: any = ReactPannellum as any;
          if (rpAny && typeof rpAny.getViewer === 'function') {
            viewer = rpAny.getViewer(`reacpanorama_key__${multiResScene.id}`);
          }
        } catch {}

        // Intento B: API global de pannellum por id
        if (!viewer) {
          const pannellum = (window as any).pannellum;
          if (pannellum && typeof pannellum.viewer === "function") {
            try { viewer = pannellum.viewer(`reacpanorama_key__${multiResScene.id}`); } catch {}
          }
        }

        // Intento C: buscar contenedor dentro del wrapper y pasar el elemento a pannellum.viewer
        if (!viewer && wrapperRef.current) {
          try {
            const container = wrapperRef.current.querySelector('.pnlm-container') as HTMLElement | null;
            const pannellum = (window as any).pannellum;
            if (container && pannellum && typeof pannellum.viewer === 'function') {
              try { viewer = pannellum.viewer(container as any); } catch {}
            }
          } catch {}
        }

        if (viewer) {
          internalViewerRef.current = viewer;
          if (mounted && onViewerReady) onViewerReady(viewer);
          if (intervalId !== undefined) window.clearInterval(intervalId);
        }
      } catch (e) {
        // ignorar
      }
    };

    // Intento inmediato y luego polling corto
    tryGetViewer();
    intervalId = window.setInterval(tryGetViewer, 200);

    return () => {
      mounted = false;
      if (intervalId !== undefined) window.clearInterval(intervalId);
      // Indicar que el viewer ya no está disponible
      try {
        internalViewerRef.current = null;
        if (onViewerReady) onViewerReady(null);
      } catch (e) {
        // ignore
      }
    };
  }, [multiResScene.id, onViewerReady]);

  // Aplicar de forma explícita la cámara cuando el viewer esté listo o cambie cameraState
  useEffect(() => {
    const v = internalViewerRef.current;
    if (!v || !cameraState) return;

    const apply = () => {
      try {
        // Cortar animaciones en curso si la API lo soporta
        try { if (typeof v.stopMovement === 'function') v.stopMovement(); } catch {}
        const { yaw, pitch, hfov } = cameraState;
        if (typeof v.lookAt === 'function') {
          v.lookAt(yaw, pitch, hfov, false);
        } else {
          if (typeof yaw === 'number' && typeof v.setYaw === 'function') v.setYaw(yaw, false);
          if (typeof pitch === 'number' && typeof v.setPitch === 'function') v.setPitch(pitch, false);
          if (typeof hfov === 'number') {
            if (typeof v.setHfov === 'function') v.setHfov(hfov, false);
            else if (typeof v.setHFOV === 'function') v.setHFOV(hfov, false);
          }
        }
        if (onCameraApplied) onCameraApplied();
      } catch {}
    };

    // Intento inmediato + rAF y un pequeño delay tras la carga
    apply();
    const raf = window.requestAnimationFrame(apply);
    let t1: number | undefined;
    // Reaplicar tras 'load' si está disponible
    let loadHandler: any = null;
    try {
      if (typeof v.on === 'function') {
        loadHandler = () => { t1 = window.setTimeout(apply, 150); };
        v.on('load', loadHandler);
      }
    } catch {}

    return () => {
      window.cancelAnimationFrame(raf);
      if (t1 !== undefined) window.clearTimeout(t1);
      try { if (loadHandler && typeof v.off === 'function') v.off('load', loadHandler); } catch {}
    };
  }, [cameraState, onCameraApplied]);

  // Exponer API imperativa para obtener la cámara actual
  useImperativeHandle(ref, () => ({
    getCamera: () => {
      try {
        const v = internalViewerRef.current;
        if (v) {
          const yaw = typeof v.getYaw === 'function' ? v.getYaw() : undefined;
          const pitch = typeof v.getPitch === 'function' ? v.getPitch() : undefined;
          const hfov = (typeof v.getHfov === 'function' ? v.getHfov() :
            (typeof v.getHFOV === 'function' ? v.getHFOV() : undefined));
          return { yaw, pitch, hfov };
        }
        // fallback: intentar obtener via API global
        const pannellum = (window as any).pannellum;
        if (pannellum && typeof pannellum.viewer === 'function') {
          const viewer = pannellum.viewer(`reacpanorama_key__${multiResScene.id}`);
          if (viewer) {
            const yaw = typeof viewer.getYaw === 'function' ? viewer.getYaw() : undefined;
            const pitch = typeof viewer.getPitch === 'function' ? viewer.getPitch() : undefined;
            const hfov = (typeof viewer.getHfov === 'function' ? viewer.getHfov() :
              (typeof viewer.getHFOV === 'function' ? viewer.getHFOV() : undefined));
            return { yaw, pitch, hfov };
          }
        }
      } catch (e) {
        // ignore
      }
      return null;
    }
  }), [multiResScene.id]);

  return hotspots !== null ? (
    <div ref={wrapperRef}>
      <ReactPannellum
        className="panorama"
        /* imageSource="./images/360photo.jpg" */
        id={`reacpanorama_key__${multiResScene.id}`}
        sceneId={`reacpanorama_sceneId__${multiResScene.id}`}
        config={config}
        multiRes={multiResScene}
        type="multires"
      ></ReactPannellum>
    </div>
  ) : null;
};

const Panorama = React.forwardRef<PanoramaHandle, PanoramaProps>(PanoramaInner);
export default memo(Panorama, (prevProps, nextProps) => {
  return prevProps.multiResScene.id === nextProps.multiResScene.id;
});
