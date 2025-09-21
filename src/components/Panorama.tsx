import React, { useState, useEffect, useMemo, memo } from "react";
import ReactPannellum from "react-pannellum";
import { PanoramaMultiRes } from "../models/Interfaces";
import axios from "axios";

interface PanoramaProps {
  id: string;
  multiResScene: PanoramaMultiRes;
}

const Panorama = ({ id, multiResScene }: PanoramaProps) => {
  const [hotspots, setHotspots] = useState<any[] | null>(null);

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

  // FIX panellum bug: Oculta el primer contenedor .pnlm-render-container incluso si se crea después del montaje.
  // Usamos MutationObserver para detectar nodos añadidos por la librería.
  useEffect(() => {
    const modified = new WeakMap<HTMLElement, string>();

    const hideFirst = () => {
      const elems = document.querySelectorAll('.pnlm-render-container');
      if (elems && elems.length > 0) {
        const first = elems[0] as HTMLElement | undefined;
        if (first && !modified.has(first)) {
          // Guardar display previo y ocultar
          modified.set(first, first.style.display || '');
          first.style.display = 'none';
        }
      }
    };

    // Intento inmediato por si ya está en el DOM
    try {
      hideFirst();
    } catch (err) {
      // ignorar
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length > 0) {
          // Intentar ocultar si se añadieron nodos
          hideFirst();
          // Si ya ocultamos, podemos seguir observando para restauración al desmontar.
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      // Restaurar estilos modificados
      try {
        modified && modified instanceof WeakMap && (function restore() {
          // WeakMap no es iterable, así que intentamos restaurar por selección directa
          const elems = document.querySelectorAll('.pnlm-render-container');
          elems.forEach((el) => {
            const elh = el as HTMLElement;
            // Solo restaurar si el estilo coincide con lo que pusimos ("none")
            if (elh.style.display === 'none') {
              const prev = modified.get(elh);
              if (typeof prev === 'string') elh.style.display = prev;
            }
          });
        })();
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
      pitch: -5,
      type: "equirectangular",
      debugger: true,
      haov: 200,
      vaov: 110,
      vOffset: 0,
      yaw: 0,
      hfov: 80,
      maxHfov: 120,
      minHfov: 20,
      compass: true,
      hotSpots: hotspots,
    }),
    [hotspots]
  );

  return hotspots !== null ? (
    <ReactPannellum
      className="panorama"
      /* imageSource="./images/360photo.jpg" */
      id={`reacpanorama_key__${multiResScene.id}`}
      sceneId={`reacpanorama_sceneId__${multiResScene.id}`}
      config={config}
      multiRes={multiResScene}
      type="multires"
    ></ReactPannellum>
  ) : null;
};

export default memo(Panorama, (prevProps, nextProps) => {
  return prevProps.multiResScene.id === nextProps.multiResScene.id;
});
