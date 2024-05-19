export class Languages {
  lang!: string;
  langname!: string;
  autonym!: string;
  active!: number;
  rtl!: number;
}

export class CustomWiki {
  id!: number;
  cartodb_id!: number;
  wiki!: string;
}

export interface WikiInfoPiece {
  title: string;
  contents: string[];
  image?: string;
  langs: WikiInfoLang[];
}

export interface WikiInfoLang {
  id: string; //lang piece name
  lang: string; // lang code
  langname: string; // lang name
  autonym: string; // lang name english
  rtl: boolean; // right to left
}

export interface AlertModel {
  title: string;
  message: string;
  type: "danger" | "success" | "warning";
}

export interface MapGeneratorModel {
  table: string;
  id: string;
  name: string;
  mapColor: string;
  fileJson: string;
}
export interface FlagsIcons {
  name: string;
  url: string;
}

export interface AlertMessageProps {
  show: boolean;
  alertMessage: AlertModel;
  onHide: () => void;
  autoClose?: number;
}

export interface ServiceWorkerConfig {
  onUpdate: (registration: ServiceWorkerRegistration) => void;
  onSuccess: (registration: ServiceWorkerRegistration) => void;
}

export interface Hotspot {
  id: string;
  pitch: number;
  yaw: number;
  type: string;
  text: string;
  URL: string;
  cssClass?: string;
}

export interface PanoramaMultiRes {
  id: string;
  title: string;
  key: string;
  basePath: string;
  path: string;
  fallbackPath: string;
  extension: string;
  tileResolution: number;
  maxLevel: number;
  cubeResolution: number;
}