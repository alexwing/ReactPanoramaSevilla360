import React, { memo, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { PanoramaMultiRes } from "../models/Interfaces";
import {
  PanoramaViewer,
  type CameraState,
  type PanoramaViewerHandle,
  type PanoramaViewerHotspot,
} from "../viewer";
import WikiHotspot from "./WikiHotspot";

interface PanoramaProps {
  id: string;
  multiResScene: PanoramaMultiRes;
  cameraState?: CameraState | null;
  onViewerReady?: (viewer: unknown | null) => void;
  onCameraApplied?: () => void;
}

export type PanoramaHandle = PanoramaViewerHandle;

type PanoramaHotspot = PanoramaViewerHotspot & {
  URL?: string;
  originalURL?: string;
};

const PanoramaInner = (
  { id, multiResScene, cameraState = null, onViewerReady, onCameraApplied }: PanoramaProps,
  ref: React.Ref<PanoramaHandle>
) => {
  const [hotspots, setHotspots] = useState<PanoramaHotspot[] | null>(null);
  const [showWikiHotspot, setShowWikiHotspot] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<{
    text: string;
    URL: string;
  } | null>(null);

  useEffect(() => {
    axios
      .get("./hotspots.json")
      .then((response) => {
        const hotspotsWithUniqueIds = response.data.map((hotspot: PanoramaHotspot) => {
          const newHotspot = {
            ...hotspot,
            id: `${multiResScene.id}_${hotspot.id}`,
          };

          if (hotspot.URL) {
            newHotspot.originalURL = hotspot.URL;
            delete newHotspot.URL;
          }

          return newHotspot;
        });

        setHotspots(hotspotsWithUniqueIds);
      })
      .catch((error) => {
        console.log("Error al leer el archivo JSON.", error);
      });
  }, [multiResScene.id]);

  const viewerConfig = useMemo(
    () => ({
      autoLoad: true,
      showControls: false,
      showFullscreenCtrl: false,
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
    }),
    [cameraState]
  );

  const handleHotspotClick = (hotspot: PanoramaViewerHotspot) => {
    const panoramaHotspot = hotspot as PanoramaHotspot;
    const url = panoramaHotspot.originalURL || panoramaHotspot.URL;

    if (typeof url !== "string") return;

    const isWikipediaUrl =
      url.includes("wikipedia.org") ||
      url.includes("es.wikipedia.org") ||
      url.includes("en.wikipedia.org");

    if (isWikipediaUrl) {
      setSelectedHotspot({
        text: String(panoramaHotspot.text ?? ""),
        URL: url,
      });
      setShowWikiHotspot(true);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return hotspots !== null ? (
    <>
      <PanoramaViewer
        ref={ref}
        className="panorama"
        id={id}
        sceneId={`reacpanorama_sceneId__${multiResScene.id}`}
        multiResScene={multiResScene}
        cameraState={cameraState}
        config={viewerConfig}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        onViewerReady={onViewerReady}
        onCameraApplied={onCameraApplied}
      />
      <WikiHotspot
        show={showWikiHotspot}
        onHide={setShowWikiHotspot}
        hotspotData={selectedHotspot}
      />
    </>
  ) : null;
};

const Panorama = React.forwardRef<PanoramaHandle, PanoramaProps>(PanoramaInner);

export default memo(Panorama, (prevProps, nextProps) => {
  return prevProps.multiResScene.id === nextProps.multiResScene.id;
});
