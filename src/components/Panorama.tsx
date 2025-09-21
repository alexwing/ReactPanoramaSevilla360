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
    try { console.log('[Panorama] mount scene', multiResScene.id); } catch {}
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
          try { console.log('[Panorama] viewer ready for scene', multiResScene.id); } catch {}
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

    const tolYaw = 0.2; // grados
    const tolPitch = 0.2; // grados
    const tolHfov = 0.5; // FOV
    const targetYaw = typeof cameraState.yaw === 'number' ? cameraState.yaw : v.getYaw?.();
    const targetPitch = typeof cameraState.pitch === 'number' ? cameraState.pitch : v.getPitch?.();
    const targetHfov = typeof cameraState.hfov === 'number' ? cameraState.hfov : v.getHfov?.();

    const nearly = (a?: number, b?: number, tol = 0.1) => {
      if (typeof a !== 'number' || typeof b !== 'number') return false;
      return Math.abs(a - b) <= tol;
    };

    const applyNow = (label?: string) => {
      try {
        if (typeof v.lookAt === 'function') {
          v.lookAt(targetYaw, targetPitch, targetHfov, false);
        } else {
          if (typeof targetYaw === 'number' && typeof v.setYaw === 'function') v.setYaw(targetYaw, false);
          if (typeof targetPitch === 'number' && typeof v.setPitch === 'function') v.setPitch(targetPitch, false);
          if (typeof targetHfov === 'number') {
            if (typeof v.setHfov === 'function') v.setHfov(targetHfov, false);
            else if (typeof v.setHFOV === 'function') v.setHFOV(targetHfov, false);
          }
        }
        try { console.log('[Panorama] applied camera', { targetYaw, targetPitch, targetHfov, label }); } catch {}
      } catch {}
    };

    let cancelled = false;
    let appliedOk = false;
    const applyAndCheck = (label?: string) => {
      if (cancelled) return;
      applyNow(label);
      try {
        const cy = typeof v.getYaw === 'function' ? v.getYaw() : undefined;
        const cp = typeof v.getPitch === 'function' ? v.getPitch() : undefined;
        const ch = typeof v.getHfov === 'function' ? v.getHfov() : (typeof v.getHFOV === 'function' ? v.getHFOV() : undefined);
        appliedOk = nearly(cy, targetYaw, tolYaw) && nearly(cp, targetPitch, tolPitch) && nearly(ch, targetHfov, tolHfov);
        if (appliedOk && onCameraApplied) onCameraApplied();
        try { console.log('[Panorama] check', { cy, cp, ch, ok: appliedOk }); } catch {}
      } catch {}
    };

    // Intentos programados por ~1.2s
    applyAndCheck('immediate');
    const raf1 = window.requestAnimationFrame(() => applyAndCheck('raf1'));
    const t1 = window.setTimeout(() => applyAndCheck('t+80ms'), 80);
    const t2 = window.setTimeout(() => applyAndCheck('t+180ms'), 180);
    const t3 = window.setTimeout(() => applyAndCheck('t+320ms'), 320);
    const t4 = window.setTimeout(() => applyAndCheck('t+500ms'), 500);
    const t5 = window.setTimeout(() => applyAndCheck('t+800ms'), 800);
    const t6 = window.setTimeout(() => applyAndCheck('t+1200ms'), 1200);

    // Enganchar eventos del viewer si existen
    const handlers: Array<[string, any]> = [];
    const addHandler = (ev: string) => {
      if (typeof v.on === 'function') {
        const h = () => applyAndCheck(ev);
        try { v.on(ev as any, h); handlers.push([ev, h]); } catch {}
      }
    };
    addHandler('load');
    addHandler('scenechangefadedone');
    addHandler('animatefinished');

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
      [t1, t2, t3, t4, t5, t6].forEach((t) => window.clearTimeout(t));
      try {
        if (typeof v.off === 'function') {
          handlers.forEach(([ev, h]) => { try { v.off(ev as any, h); } catch {} });
        }
      } catch {}
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
