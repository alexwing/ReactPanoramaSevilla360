import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import ReactPannellum, {
  usePannellum,
  type ReactPannellumConfig,
  type PannellumViewerApi,
} from "react-pannellum";

export interface CameraState {
  yaw?: number;
  pitch?: number;
  hfov?: number;
}

export interface PanoramaViewerMultiRes {
  basePath?: string;
  path?: string;
  fallbackPath?: string;
  extension?: string;
  tileResolution?: number;
  maxLevel?: number;
  cubeResolution?: number;
}

export type PanoramaViewerHotspot = Record<string, unknown> & {
  pitch: number;
  yaw: number;
  type: string;
  id?: string;
  text?: string;
  URL?: string;
  cssClass?: string;
};

export type PanoramaViewerHandle = {
  getCamera: () => CameraState | null;
  resetToInitial: (camera?: CameraState | null) => boolean;
};

export interface PanoramaViewerProps {
  id: string;
  sceneId: string;
  multiResScene: PanoramaViewerMultiRes;
  cameraState?: CameraState | null;
  config?: Record<string, unknown>;
  hotspots?: PanoramaViewerHotspot[];
  className?: string;
  hotspotClickClasses?: string[];
  onHotspotClick?: (hotspot: PanoramaViewerHotspot, event: MouseEvent) => void;
  onViewerReady?: (viewer: unknown | null) => void;
  onCameraApplied?: () => void;
}

type ViewerLike = Partial<PannellumViewerApi> & {
  getHFOV?: () => number | undefined;
  setHFOV?: (hfov: number, animated?: number | boolean) => void;
};

const getCameraFromViewer = (viewer: ViewerLike | null): CameraState | null => {
  if (!viewer) return null;

  const yaw = viewer.getYaw?.();
  const pitch = viewer.getPitch?.();
  const hfov = viewer.getHfov?.() ?? viewer.getHFOV?.();

  if (
    typeof yaw !== "number" &&
    typeof pitch !== "number" &&
    typeof hfov !== "number"
  ) {
    return null;
  }

  return { yaw, pitch, hfov };
};

const applyCameraToViewer = (
  viewer: ViewerLike | null,
  camera: CameraState | null
): boolean => {
  if (!viewer || !camera) return false;

  try {
    viewer.stopMovement?.();
  } catch {
    // ignore
  }

  try {
    const { yaw, pitch, hfov } = camera;

    if (
      typeof viewer.lookAt === "function" &&
      typeof pitch === "number" &&
      typeof yaw === "number" &&
      typeof hfov === "number"
    ) {
      viewer.lookAt(pitch, yaw, hfov, 0);
      return true;
    }

    if (typeof yaw === "number") viewer.setYaw?.(yaw, 0);
    if (typeof pitch === "number") viewer.setPitch?.(pitch, 0);

    if (typeof hfov === "number") {
      if (typeof viewer.setHfov === "function") {
        viewer.setHfov(hfov, 0);
      } else {
        viewer.setHFOV?.(hfov, 0);
      }
    }

    return true;
  } catch {
    return false;
  }
};

interface PannellumApiBridgeProps {
  cameraState: CameraState | null;
  initialCameraRef: React.MutableRefObject<CameraState | null>;
  viewerApiRef: React.MutableRefObject<PannellumViewerApi | null>;
  onViewerReady?: (viewer: unknown | null) => void;
  onCameraApplied?: () => void;
}

const PannellumApiBridge = ({
  cameraState,
  initialCameraRef,
  viewerApiRef,
  onViewerReady,
  onCameraApplied,
}: PannellumApiBridgeProps): null => {
  const api = usePannellum();

  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;

    const syncViewer = () => {
      const viewer = api.getViewer();
      if (!viewer) return;

      viewerApiRef.current = api;

      if (!initialCameraRef.current) {
        initialCameraRef.current = getCameraFromViewer(api);
      }

      if (mounted) {
        onViewerReady?.(viewer);
      }

      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };

    syncViewer();
    intervalId = window.setInterval(syncViewer, 200);

    return () => {
      mounted = false;
      if (intervalId !== undefined) window.clearInterval(intervalId);
      viewerApiRef.current = null;
      onViewerReady?.(null);

      try {
        api.destroy();
      } catch {
        // ignore
      }
    };
  }, [api, initialCameraRef, onViewerReady, viewerApiRef]);

  useEffect(() => {
    if (!cameraState) return;

    let applied = false;
    let intervalId: number | undefined;
    let timeoutId: number | undefined;
    let animationFrameId: number | undefined;

    const tryApplyCamera = () => {
      if (applied || !api.getViewer()) return;

      applied = applyCameraToViewer(api, cameraState);
      if (applied) {
        onCameraApplied?.();
        if (intervalId !== undefined) window.clearInterval(intervalId);
      }
    };

    tryApplyCamera();
    animationFrameId = window.requestAnimationFrame(tryApplyCamera);
    timeoutId = window.setTimeout(tryApplyCamera, 150);
    intervalId = window.setInterval(tryApplyCamera, 200);

    return () => {
      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [api, cameraState, onCameraApplied]);

  return null;
};

const PanoramaViewer = forwardRef<PanoramaViewerHandle, PanoramaViewerProps>(
  (
    {
      id,
      sceneId,
      multiResScene,
      cameraState = null,
      config = {},
      hotspots,
      className = "panorama",
      hotspotClickClasses = ["wiki-info", "pnlm-info"],
      onHotspotClick,
      onViewerReady,
      onCameraApplied,
    },
    ref
  ) => {
    const viewerApiRef = useRef<PannellumViewerApi | null>(null);
    const initialCameraRef = useRef<CameraState | null>(null);

    useEffect(() => {
      const modified = new WeakMap<HTMLElement, string>();

      const hideFirstIfNeeded = () => {
        const elems = document.querySelectorAll(".pnlm-render-container");
        if (elems.length >= 2) {
          const first = elems[0] as HTMLElement | undefined;
          if (first && !modified.has(first)) {
            modified.set(first, first.style.display || "");
            first.style.display = "none";
          }
        }
      };

      try {
        hideFirstIfNeeded();
      } catch {
        // ignore
      }

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            hideFirstIfNeeded();
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();

        try {
          const elems = document.querySelectorAll(".pnlm-render-container");
          elems.forEach((element) => {
            const htmlElement = element as HTMLElement;
            const previousDisplay = modified.get(htmlElement);
            if (typeof previousDisplay === "string") {
              htmlElement.style.display = previousDisplay;
            }
          });
        } catch {
          // ignore
        }
      };
    }, []);

    useEffect(() => {
      if (!onHotspotClick) return;

      let isMouseDown = false;
      let mouseDownTime = 0;

      const handleMouseDown = () => {
        isMouseDown = true;
        mouseDownTime = Date.now();
      };

      const handleMouseUp = (event: MouseEvent) => {
        const clickDuration = Date.now() - mouseDownTime;
        isMouseDown = false;

        if (clickDuration >= 200) return;

        const target = event.target as HTMLElement;
        const hotspotElement = target.closest(".pnlm-hotspot") as HTMLElement;

        if (
          !hotspotElement ||
          !hotspotClickClasses.some((className) =>
            hotspotElement.classList.contains(className)
          )
        ) {
          return;
        }

        const hotspot = hotspots?.find((item) => {
          return hotspotElement.textContent?.trim() === item.text;
        });

        if (!hotspot) return;

        event.preventDefault();
        event.stopPropagation();
        onHotspotClick(hotspot, event);
      };

      const timeoutId = window.setTimeout(() => {
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
      }, 1000);

      return () => {
        window.clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [hotspotClickClasses, hotspots, onHotspotClick]);

    const viewerConfig = useMemo<ReactPannellumConfig>(
      () => ({
        ...config,
        hotSpots: hotspots,
      } as ReactPannellumConfig),
      [config, hotspots]
    );

    useImperativeHandle(ref, () => ({
      getCamera: () => {
        return getCameraFromViewer(viewerApiRef.current);
      },
      resetToInitial: (camera?: CameraState | null) => {
        return applyCameraToViewer(
          viewerApiRef.current,
          camera ?? initialCameraRef.current
        );
      },
    }), []);

    return (
      <ReactPannellum
        className={className}
        id={id}
        sceneId={sceneId}
        config={viewerConfig}
        multiRes={multiResScene}
        type="multires"
      >
        <PannellumApiBridge
          cameraState={cameraState}
          initialCameraRef={initialCameraRef}
          viewerApiRef={viewerApiRef}
          onViewerReady={onViewerReady}
          onCameraApplied={onCameraApplied}
        />
      </ReactPannellum>
    );
  }
);

PanoramaViewer.displayName = "PanoramaViewer";

export default PanoramaViewer;
