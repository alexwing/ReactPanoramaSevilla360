export class PuzzleService {

  //get resource from url, not server side, client side
  public static getResource(url: string): Promise<string> {
    return fetch(url)
      .then((response) => response.text())
      .then((text) => text);     
  }

}
