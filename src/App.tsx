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
  const [cameraByScene, setCameraByScene] = useState<Record<string, CameraState>>({});
  // Ref para mantener la API imperativa expuesta por Panorama
  const panoramaRef = React.useRef<any | null>(null);
  // Cámara a aplicar en el siguiente panorama seleccionado (última vista)
  const [pendingCamera, setPendingCamera] = useState<CameraState | null>(null);

  const handleMultiRes = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const scene = multiRes.find((s) => s.id === event.currentTarget.id);
    if (scene) {
      try { console.log('[App] switching scene', sceneSelected.id, '->', scene.id); } catch {}
      // Antes de cambiar, pedimos al componente Panorama su cámara actual (getCamera)
      try {
        const api = panoramaRef.current;
        if (api && typeof api.getCamera === 'function') {
          const cam = api.getCamera();
          if (cam) {
            try { console.log('[App] captured camera before switch', cam, 'from scene', sceneSelected.id, 'to', scene.id); } catch {}
            // Guardamos por escena anterior (opcional) y como pendingCamera para aplicar en la nueva
            setCameraByScene(prev => ({ ...prev, [sceneSelected.id]: cam }));
            setPendingCamera(cam);
          }
          else {
            try { console.log('[App] getCamera() returned null, trying global pannellum fallback'); } catch {}
            try {
              const pannellum = (window as any).pannellum;
              if (pannellum && typeof pannellum.viewer === 'function') {
                const viewer = pannellum.viewer(`reacpanorama_key__${sceneSelected.id}`);
                if (viewer) {
                  const yaw = typeof viewer.getYaw === 'function' ? viewer.getYaw() : undefined;
                  const pitch = typeof viewer.getPitch === 'function' ? viewer.getPitch() : undefined;
                  const hfov = (typeof viewer.getHfov === 'function' ? viewer.getHfov() : (typeof viewer.getHFOV === 'function' ? viewer.getHFOV() : undefined));
                  const cam2 = { yaw, pitch, hfov };
                  try { console.log('[App] captured via fallback', cam2); } catch {}
                  setCameraByScene(prev => ({ ...prev, [sceneSelected.id]: cam2 }));
                  setPendingCamera(cam2);
                }
              }
            } catch {}
          }
        }
      } catch (e) {
        // ignorar
      }

      setSceneSelected(scene);
    }
  };

  return (
    <Container fluid className="p-0">
      <MenuTop multiRes={multiRes} handleMultiRes={handleMultiRes} />
      <Panorama
        id={`panorama_id_${sceneSelected.id}`}
        key={`panorama_key_${sceneSelected.id}`}
        multiResScene={sceneSelected}
        // pasar cámara a aplicar: la más reciente (pending) o la propia guardada por escena
        cameraState={pendingCamera ?? cameraByScene[sceneSelected.id]}
  // obtenemos la api imperativa del Panorama
  ref={panoramaRef}
        onCameraApplied={() => setPendingCamera(null)}
      />
    </Container>
  );
};

export default Main;
