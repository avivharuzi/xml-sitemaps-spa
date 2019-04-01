class Injector$ {
  static getAllValidUrls() {
    const aElements = document.querySelectorAll('a');

    let urls = [];

    if (aElements.length > 0) {
      aElements.forEach(aElement => {
        const href = aElement.href;

        if (Injector$.isUrl(href) && Injector$.isBelongToTheHostname(href)) {
          urls.push(Injector$.removeFragment(href));
        }
      });
    }

    return Injector$.filterDuplicates(urls);
  }

  static isUrl(s) {
    const regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
  }

  static isBelongToTheHostname(url) {
    return url.search(window.location.hostname) > -1;
  }

  static filterDuplicates(arr) {
    let result = [];

    arr.forEach((item) => {
      if (result.indexOf(item) < 0) {
        result.push(item);
      }
    });

    return result;
  }

  static removeFragment(url) {
    if (url.lastIndexOf('#') > -1) {
      return url.substring(0, url.lastIndexOf('#'));
    }

    return url;
  }
}

module.exports = Injector$;
