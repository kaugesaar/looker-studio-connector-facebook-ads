namespace Utils {
  /**
   * Returns uri friendly string from an string object of params.
   *
   * @param obj paramobject
   * @returns querystring
   */
  export function querystring(obj: { [key: string]: string | number }): string {
    const str = [];
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      str.push(
        `${encodeURIComponent(keys[i])}=${encodeURIComponent(obj[keys[i]])}`
      );
    }
    return str.join("&");
  }

  /**
   * Transforms the first letter of each word to upper case.
   *
   * @param str The string
   * @returns The formated string
   */
  export function toTitleCase(str: string) {
    return str.replace(/(^|\s)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  }
}
