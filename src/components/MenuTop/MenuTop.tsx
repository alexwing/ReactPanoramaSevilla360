import React, { useContext, useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Info from "../Info";
import ThemeContext from "../../components/ThemeProvider";
import { Nav } from "react-bootstrap";
import PuzzleOptions from "./PuzzleOptions";
import { WikiInfoLang } from "../../models/Interfaces";
import { getCurrentLang, getLang, getListLanguages, setVisibleHostspots } from "../../lib/Utils";
import LangSelector from "../LangSelector";
import { setCookie } from "react-simple-cookie-store";
import { ConfigService } from "../../services/configService";
import { useTranslation } from "react-i18next";

const MenuTop = ({ name }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [currentLang, setCurrentLang] = useState("");
  const [langs, setLangs] = useState([] as WikiInfoLang[]);
  const [lang, setLang] = useState("");
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [poisVisible, setPoisVisible] = useState(true);


  useEffect(() => {
    const langAux = getLang();
    i18n.changeLanguage(langAux);
    setLang(langAux);
    setShowInfo(false);
    getLanguages();
  }, []);
  
  useEffect(() => {
    setVisibleHostspots(poisVisible);
  }, [poisVisible]);

  const getLanguages = () => {
    const wikiInfoLang: WikiInfoLang[] = getListLanguages();
    setLangs(wikiInfoLang);
    setCurrentLang(getCurrentLang(wikiInfoLang));
  };

  const handleInfo = () => {
    setShowInfo(true);
  };

  const handleCancel = () => {
    setShowInfo(false);
  };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLangChange = (e: any) => {
    const lang = e.target.id;
    setCookie("puzzleLanguage", lang, ConfigService.cookieDays);
    //change lang in i18n
    i18n.changeLanguage(lang);
    setCurrentLang(getCurrentLang(langs));
    onLangChange(lang);
  };

  const onLangChange = (lang: string) => {
    setLang(lang);
  };

  const onFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handlePois = () => {
    setPoisVisible(!poisVisible);
  }


  return (
    <React.Fragment>
      <Navbar bg={theme} expand="lg">
        <Navbar.Brand>
          <img src="./logo192.png" alt="" />
          {name}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          <LangSelector
            langs={langs}
            onSelectLang={handleLangChange}
            currentLang={currentLang}
          ></LangSelector>
            <PuzzleOptions
              onFullScreen={onFullScreen}
              handleInfo={handleInfo}
              handlePois={handlePois}
            />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Info name={name} show={showInfo} InfoClose={handleCancel} />
    </React.Fragment>
  );
};

export default MenuTop;
