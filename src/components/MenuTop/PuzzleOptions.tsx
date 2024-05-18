import React, { useCallback, useContext } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import ThemeContext from "../ThemeProvider";
import * as Icon from "react-bootstrap-icons";
import Tooltip from "react-bootstrap/Tooltip";
import { OverlayTrigger } from "react-bootstrap";
import { useMediaQuery } from 'react-responsive';
import { setCookie } from "react-simple-cookie-store";
import { ConfigService } from "../../services/configService";

interface PuzzleOptionsProps {
  handleInfo: () => void;
  handlePois: () => void;
}

function PuzzleOptions({
  handleInfo,
  handlePois,
}: PuzzleOptionsProps): JSX.Element {
  const { theme, setTheme } = useContext(ThemeContext);
  const [ poisVisible, setPoisVisible ] = React.useState(true);
  const [ fullScreen, setFullScreen ] = React.useState(false);

  const onThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setCookie("theme", theme === "dark" ? "light" : "dark", ConfigService.cookieDays);
  };

  const onPoisChange = () => {
    setPoisVisible(!poisVisible);
    handlePois();
  }

  const onFullScreen = () => {
    setFullScreen(!fullScreen);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const { t } = useTranslation();
  const size = 28;

  const buttons = [

    // enable/disable pois
    { id: "pois",
      variant: "none",
      onClickHandler: onPoisChange,
      tooltip: t("topMenu.pois"),
      icon: poisVisible ? Icon.InfoCircleFill : Icon.InfoCircle,
      iconSize: size,
      iconColor: "",
      iconClass: "me-2",
      label: t("topMenu.pois"),
      labelClass: "d-lg-none",
      visible: true,
    },
    { id: "fullscreen",
      variant: "none",
      onClickHandler: onFullScreen,
      tooltip: t("topMenu.fullscreen"),
      icon:  fullScreen ? Icon.FullscreenExit : Icon.Fullscreen,
      iconSize: size,
      iconColor: "",
      iconClass: "me-2",
      label: t("topMenu.fullscreen"),
      labelClass: "d-lg-none",
      visible: true,
    },
    { id: "theme",
      variant: "none",
      onClickHandler: onThemeChange,
      tooltip: theme === "light" ? t("topMenu.dark") : t("topMenu.light"),
      icon: theme === "light" ? Icon.Moon : Icon.Sun,
      iconSize: size,
      iconColor: "",
      iconClass: "me-2",
      label: theme === "light" ? t("topMenu.dark") : t("topMenu.light"),
      labelClass: "d-lg-none",
      visible: true,
    },
    { id: "info",
      variant: "none",
      onClickHandler: handleInfo,
      tooltip: t("topMenu.about"),
      icon: Icon.InfoCircle,
      iconSize: size,
      iconColor: "",
      iconClass: "me-2",
      label: t("topMenu.about"),
      labelClass: "d-lg-none",
      visible: true,
    },    
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlay = useCallback((button: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (useMediaQuery({ minWidth: 992 }) ? (
      <Tooltip id={`tooltip-${button.id}`}>{button.tooltip}</Tooltip>
    ) : <span></span>) as JSX.Element;
  }, []); 

  return (
    <React.Fragment>
      <Form>
        {buttons.map((button, index) => (
                    <OverlayTrigger
            key={index}
            placement="bottom"
            overlay={overlay(button)}
          >
          
          <Button
            key={index}
            id={button.id}
            variant={button.variant}
            onClick={button.onClickHandler}
            style={{ display: button.visible ? "inline" : "none" }}
          >
            <span>
              <button.icon size={button.iconSize} className={button.iconClass} />
              <span className={button.labelClass}>{button.label}</span>
            </span>
          </Button>
          </OverlayTrigger>
        ))}

      </Form>
    </React.Fragment>
  );
}
export default PuzzleOptions;
