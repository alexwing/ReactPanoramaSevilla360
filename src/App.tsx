import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useMemo } from "react";
import MenuTop from "./components/MenuTop/MenuTop";
import Panorama from "./components/Panorama";
import "./styles/MapPuzzle.css";
import "./styles/responsive.css";
import { Container } from "react-bootstrap";
import { PanoramaMultiRes } from "./models/Interfaces";
import { useTranslation } from "react-i18next";

const Main = () => {
  const { t, i18n } = useTranslation();

  const multiRes = useMemo(
    () =>
      [
        {
          id: "1",
          title: t("scene.color"),
          key: "scene_color",
          basePath: "./360photo",
          path: "/%l/%s%y_%x",
          fallbackPath: "/fallback/%s",
          extension: "jpg",
          tileResolution: 512,
          maxLevel: 6,
          cubeResolution: 11456,
        },
        {
          id: "2",
          title: t("scene.bn"),
          key: "scene_bn",
          basePath: "./360photoBN",
          path: "/%l/%s%y_%x",
          fallbackPath: "/fallback/%s",
          extension: "jpg",
          tileResolution: 512,
          maxLevel: 6,
          cubeResolution: 11456,
        },
        {
          id: "3",
          title: t("scene.original"),
          key: "scene_original",
          basePath: "./360photoOriginal",
          path: "/%l/%s%y_%x",
          fallbackPath: "/fallback/%s",
          extension: "jpg",
          tileResolution: 512,
          maxLevel: 6,
          cubeResolution: 11456,
        },
      ] as PanoramaMultiRes[],
    [t]
  );
  interface CameraState { yaw?: number; pitch?: number; hfov?: number }

  const [sceneSelected, setSceneSelected] = useState(multiRes[0]);
  // Ref a la API imperativa del Panorama (getCamera)
  const panoramaRef = React.useRef<any | null>(null);
  // Cámara global a restaurar en el próximo panorama
  const [pendingCamera, setPendingCamera] = useState<CameraState | null>(null);
  // Cámara inicial (capturada cuando el viewer está listo por primera vez)
  const [initialCamera, setInitialCamera] = useState<CameraState | null>(null);

  const handleMultiRes = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const scene = multiRes.find((s) => s.id === event.currentTarget.id);
    if (scene) {
      // Antes de cambiar, pedimos al componente Panorama su cámara actual (getCamera)
      try {
        const api = panoramaRef.current;
        if (api && typeof api.getCamera === 'function') {
          const cam = api.getCamera();
          if (cam) setPendingCamera(cam);
        }
      } catch {}

      setSceneSelected(scene);
    }
  };

  const handleResetView = () => {
    try {
      // Intentar usar método imperativo del panorama para resetear a la cámara inicial
      const api = panoramaRef.current as any;
      if (api && typeof api.resetToInitial === 'function') {
        // pasar la cámara inicial capturada (si existe) para forzar usar siempre la misma
        const ok = api.resetToInitial(initialCamera ?? null);
        if (ok) return;
      }
      // Fallback: Preferir la cámara inicial capturada en App. Si no existe, intentar leer la cámara actual del viewer.
      if (initialCamera) {
        setPendingCamera(initialCamera);
      } else {
        if (api && typeof api.getCamera === 'function') {
          const cam = api.getCamera();
          if (cam) setPendingCamera(cam);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleViewerReady = (viewer: any | null) => {
    try {
      // Capturar la cámara inicial la primera vez que el viewer esté listo
      if (!initialCamera) {
        const api = panoramaRef.current;
        if (api && typeof api.getCamera === 'function') {
          const cam = api.getCamera();
          if (cam) setInitialCamera(cam);
        } else if (viewer) {
          // intentar usar el viewer pasado como argumento
          const yaw = typeof viewer.getYaw === 'function' ? viewer.getYaw() : undefined;
          const pitch = typeof viewer.getPitch === 'function' ? viewer.getPitch() : undefined;
          const hfov = (typeof viewer.getHfov === 'function' ? viewer.getHfov() :
            (typeof viewer.getHFOV === 'function' ? viewer.getHFOV() : undefined));
          setInitialCamera({ yaw, pitch, hfov });
        }
      }
    } catch {
      // ignore
    }
  };

  return (
    <Container fluid className="p-0">
  <MenuTop multiRes={multiRes} handleMultiRes={handleMultiRes} handleResetView={handleResetView} />
      <Panorama
        id={`panorama_id_${sceneSelected.id}`}
        key={`panorama_key_${sceneSelected.id}`}
        multiResScene={sceneSelected}
        // Pasar la cámara global pendiente a aplicar
        cameraState={pendingCamera}
        // Obtener la API imperativa del Panorama
  ref={panoramaRef}
        // Capturar viewer cuando esté listo (para almacenar cámara inicial)
        onViewerReady={handleViewerReady}
        onCameraApplied={() => setPendingCamera(null)}
      />
    </Container>
  );
};

export default Main;
