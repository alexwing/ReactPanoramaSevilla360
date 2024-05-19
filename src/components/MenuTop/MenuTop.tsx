import React, { useContext, useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Info from "../Info";
import ThemeContext from "../../components/ThemeProvider";
import { Nav } from "react-bootstrap";
import PuzzleOptions from "./PuzzleOptions";
import { PanoramaMultiRes, WikiInfoLang } from "../../models/Interfaces";
import { getCurrentLang, getLang, getListLanguages, setVisibleHostspots } from "../../lib/Utils";
import LangSelector from "../LangSelector";
import { setCookie } from "react-simple-cookie-store";
import { ConfigService } from "../../services/configService";
import { useTranslation } from "react-i18next";
import PanoramaSelector from "../PanoramaSelector";

interface MenuTopProps {
  multiRes: PanoramaMultiRes[];
  handleMultiRes: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const MenuTop = ({ multiRes, handleMultiRes }: MenuTopProps): JSX.Element => {
  const [showInfo, setShowInfo] = useState(false);
  const [currentLang, setCurrentLang] = useState("");
  const [langs, setLangs] = useState([] as WikiInfoLang[]);
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [poisVisible, setPoisVisible] = useState(true);


  useEffect(() => {
    const langAux = getLang();
    i18n.changeLanguage(langAux);
    setShowInfo(false);
    getLanguages();
  }, [i18n]);
  
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
  };




  const handlePois = () => {
    setPoisVisible(!poisVisible);
  }


  return (
    <React.Fragment>
      <Navbar bg={theme} expand="lg">
        <Navbar.Brand>
          <img src="./logo192.png" alt="" />
          { t("topMenu.title") }
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <PanoramaSelector 
            scenes={multiRes}
            currentScene={multiRes[0].id}
            onSelectScene={handleMultiRes}
          />
          <Nav className="ms-auto">
          <LangSelector
            langs={langs}
            onSelectLang={handleLangChange}
            currentLang={currentLang}
          ></LangSelector>
            <PuzzleOptions
              handleInfo={handleInfo}
              handlePois={handlePois}
            />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Info show={showInfo} InfoClose={handleCancel} />
    </React.Fragment>
  );
};

export default MenuTop;
