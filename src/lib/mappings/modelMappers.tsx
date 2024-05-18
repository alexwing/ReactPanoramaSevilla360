/* eslint-disable @typescript-eslint/no-explicit-any */
import {  WikiInfoLang, WikiInfoPiece } from "../../models/Interfaces";
import { sortLangs } from "../Utils";
  

//map wiki response to wiki info
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function mapWikiResponseToWikiInfo(response: any): WikiInfoPiece {
    const { pages } = response.query;
    const page = pages[Object.keys(pages)[0]];
    const title = page.title;
    const contents = page.extract.split("\n");
    let langs = page.langlinks.map((x: any) => {
      return {
        id: x["*"],
        lang: x.lang,
        langname: x.langname,
        autonym: x.autonym,
      } as WikiInfoLang;
    });
    //add english to lang
    langs.push({
      id: title,
      lang: "en",
      langname: "English",
      autonym: "English",
    } as WikiInfoLang);
    //order langs by langname
    langs = sortLangs(langs);
    return {
      title,
      contents,
      langs,
    };
  }