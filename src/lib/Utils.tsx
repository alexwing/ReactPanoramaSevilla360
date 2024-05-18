import React from "react";
import { getCookie } from "react-simple-cookie-store";
import { ConfigService } from "../services/configService";
import { CustomWiki, Languages, WikiInfoLang } from "../models/Interfaces";



/**
 * Fetches a JSON file from the specified filepath and returns its contents as a Promise.
 * @param filepath - The path to the JSON file to fetch.
 * @returns A Promise that resolves to the contents of the fetched JSON file.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function Jsondb(filepath: string): Promise<any> {
  return fetch(filepath, {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
    }),
  })
    .then((res) => res.json())
    .catch((error) => console.log(error));
}


/**
 * Returns the current URL of the page, excluding the protocol and path.
 * If the URL includes "localhost", it returns "mappuzzle.xyz".
 * @returns The current URL of the page.
 */
export function getUrl(): string {
  const url = window.location.href.split("/")[2];
  if (url.includes("localhost")) {
    return "mappuzzle.xyz";
  }
  return url;
}

/**
 * Removes HTML comments, references, and audio descriptions from a given array of strings.
 * @param html - The array of strings to remove HTML comments, references, and audio descriptions from.
 * @returns The array of strings without HTML comments, references, and audio descriptions.
 */
export function cleanWikiComment(html: string[]): string[] {
  //remove comment
  let htmlAux = cleanHtmlComment(html.join(""));

  //remove references <sup>...</sup>
  htmlAux = htmlAux.replace(/<sup[\s\S]*?<\/sup>/g, "");
  //remove audio description
  htmlAux = htmlAux.replace(
    "<span>(<span><span><span></span>listen</span></span>)</span>",
    ""
  );
  htmlAux = htmlAux.replace(
    '<small class="nowrap">&nbsp;( escuchar)</small>',
    ""
  );

  //convert string to array
  return [htmlAux];
}

/**
 * Removes HTML comments from a given string.
 * @param html - The string to remove HTML comments from.
 * @returns The string without HTML comments.
 */
function cleanHtmlComment(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * Cleans a given name to generate a Wikipedia URL.
 * @param name - The name to clean.
 * @returns The cleaned Wikipedia URL.
 */
function cleanNameToWiki(name: string): string {
  let wiki_url = name.trim();
  wiki_url = wiki_url.replace("(disputed)", "");
  //if include string " - " split and take the first part
  if (wiki_url.includes(" - ")) {
    wiki_url = wiki_url.split(" - ")[0];
  }
  //replace - to space
  //wiki_url = wiki_url.replace(/-/g, " ");
  //remove (Disputed)
  wiki_url = wiki_url.replace(/ /g, "_");
  return wiki_url;
}

/**
 * Returns a Wikipedia URL for a given name and custom Wikipedia URL, if available.
 * If a custom Wikipedia URL is not available, it generates a Wikipedia URL from the name.
 * @param cartodb_id - The cartodb_id of the feature.
 * @param name - The name to generate a Wikipedia URL from.
 * @param custom_wiki - An array of custom Wikipedia URLs, if available.
 * @returns The Wikipedia URL.
 */
export function getWiki(
  cartodb_id: number,
  name: string,
  custom_wiki: CustomWiki[]
): string {
  let wiki_url = "";
  if (custom_wiki) {
    wiki_url =
      custom_wiki.find((x: CustomWiki) => x.cartodb_id === cartodb_id)?.wiki ||
      "";
  }
  if (wiki_url !== "") {
    return wiki_url;
  } else {
    return cleanNameToWiki(name);
  }
}

/**
 * Returns a Wikipedia URL for a given name and custom Wikipedia URL, if available.
 * If a custom Wikipedia URL is not available, it generates a Wikipedia URL from the name.
 * @param name - The name to generate a Wikipedia URL from.
 * @param custom_wiki - A custom Wikipedia URL, if available.
 * @returns The Wikipedia URL.
 */
export function getWikiSimple(name: string, custom_wiki: string): string {
  let wiki_url = "";
  if (custom_wiki) {
    wiki_url = custom_wiki;
  }
  if (wiki_url !== "") {
    return wiki_url;
  } else {
    return cleanNameToWiki(name);
  }
}



/**
 * Returns the language name with the autonym if available.
 * @param piece - A WikiInfoLang object containing information about a language.
 * @returns The language name as a string.
 */
export function langName(piece: WikiInfoLang): string {
  if (piece.autonym === "") {
    return piece.langname;
  } else {
    if (piece.autonym === piece.langname) {
      return piece.langname;
    } else {
      return piece.langname + " (" + piece.autonym + ")";
    }
  }
}

/**
 * Gets the current language based on the user's selected language and an array of WikiInfoLang objects.
 * @param langs - An array of WikiInfoLang objects.
 * @returns The current language as a string.
 */
export function getCurrentLang(langs: WikiInfoLang[]): string {
  const puzzleLanguage = getLang();
  //find in pieceInfo.langs the lang with the same lang as puzzleLanguage
  let pieceLang = langs.find((x: WikiInfoLang) => x.lang === puzzleLanguage);
  if (typeof pieceLang === "object" && pieceLang !== null) {
    return langName(pieceLang);
  } else {
    pieceLang = langs.find(
      (x: WikiInfoLang) => x.lang === ConfigService.defaultLang
    );
    if (typeof pieceLang === "object" && pieceLang !== null) {
      return langName(pieceLang);
    } else {
      return "Unknown";
    }
  }
}

/**
 * Gets the title of the language from an array of WikiInfoLang objects based on the current language.
 * @param langs - An array of WikiInfoLang objects.
 * @returns The title of the language as a string.
 */
export function getTitleFromLang(langs: WikiInfoLang[]): string {
  //find in pieceInfo.langs the lang with the same lang as puzzleLanguage
  const lang = getLang();
  const pieceLang = langs.find((x: WikiInfoLang) => x.lang === lang);
  if (typeof pieceLang === "object" && pieceLang !== null) {
    return pieceLang.id;
  } else {
    return "";
  }
}

/**
 * Converts an array of Languages objects to an array of WikiInfoLang objects.
 * @param languages - An array of Languages objects to be converted.
 * @returns An array of WikiInfoLang objects.
 */
export function languagesToWikiInfoLang(
  languages: Languages[]
): WikiInfoLang[] {
  return languages.map((lang: Languages) => {
    return {
      lang: lang.lang,
      name: lang.lang,
      langname: lang.langname,
      autonym: lang.autonym,
      rtl: lang.rtl,
    } as unknown as WikiInfoLang;
  });
}

/**
 * Sorts an array of WikiInfoLang objects by their langname property.
 * @param langs - An array of WikiInfoLang objects to be sorted.
 * @returns A sorted array of WikiInfoLang objects.
 */
export function sortLangs(langs: WikiInfoLang[]): WikiInfoLang[] {
  langs.sort((a: WikiInfoLang, b: WikiInfoLang) => {
    if (a.langname < b.langname) {
      return -1;
    }
    if (a.langname > b.langname) {
      return 1;
    }
    return 0;
  });
  return langs;
}

/**
 * Gets the language code for the current user, based on their browser language or a saved cookie.
 * @returns The language code as a string.
 */
export function getLang(): string {
  const lang = getCookie("puzzleLanguage");
  if (lang === undefined || lang === "") {
    let browserLang = navigator.language;
    if (browserLang.includes("-")) {
      browserLang = navigator.language.split("-")[0];
    }
    const lang = ConfigService.langs.find((x: string) => x === browserLang);
    if (lang !== undefined) {
      return lang;
    } else {
      return ConfigService.defaultLang;
    }
  } else {
    return lang;
  }
}


/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param arr - The array to shuffle.
 * @returns An iterable iterator of the shuffled array.
 */
export function* shuffle<T>(arr: T[]): IterableIterator<T> {
  arr = [...arr];
  while (arr.length) yield arr.splice((Math.random() * arr.length) | 0, 1)[0];
}

/* clean url params */
export function cleanUrlParams(url: string): string {
  const index = url.indexOf("&");
  if (index > -1) {
    return url.substring(0, index);
  } else {
    return url;
  }
}
