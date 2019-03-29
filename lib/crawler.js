const chalk = require('chalk');
const puppeteer = require('puppeteer');

class Crawler {
  constructor(limit = 0, exclude = [], log = false) {
    this.limit = limit;
    this.exclude = exclude;
    this.log = log;
    this.crawledUrls = [];
    this.crawledData = [];
  }

  async getInjectedUrlData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const response = await page.goto(url, {
      timeout: 0
    });

    const headers = response.headers();
    const lastModified = headers['last-modified'];

    await page.addScriptTag({
      path: 'lib/injector.js'
    });

    const urls = await page.evaluate(() => Injector.getAllValidUrls());

    await browser.close();

    return {
      lastModified: lastModified,
      urls: urls
    };
  }

  async recurse(urls) {
    for (let url of urls) {
      if (this.limit !== 0 && this.crawledUrls.length === this.limit) {
        break;
      }

      if (this.crawledUrls.indexOf(url) > -1) {
        continue;
      }

      if (this.isUrlExcluded(url)) {
        continue;
      }

      let data;

      try {
        data = await this.getInjectedUrlData(url);
      } catch (err) {
        this.crawledUrls.push(url);

        if (this.log) {
          console.log(chalk.red(url));
        }

        continue;
      }

      if (this.log) {
        console.log(chalk.green(url));
      }

      const relativeUrls = data.urls;

      this.crawledUrls.push(url);

      this.crawledData.push({
        url: url,
        lastModified: data.lastModified
      });

      if (relativeUrls.length > 1) {
        await this.recurse(relativeUrls);
      }
    }
  }

  async crawl(url) {
    this.crawledUrls = [];

    let firstUrlsData = await this.getInjectedUrlData(url);

    if (!firstUrlsData.urls.length) {
      return false;
    }

    await this.recurse(firstUrlsData.urls);

    return this.getCrawledData();
  }

  isUrlExcluded(url) {
    if (!this.exclude.length) {
      return false;
    }

    let isExcluded = false;

    for (let e of this.exclude) {
      let regex = new RegExp(e);

      if (regex.test(url)) {
        isExcluded = true;
        break;
      }
    }

    return isExcluded;
  }

  getCrawledUrls() {
    return this.crawledUrls;
  }

  getCrawledData() {
    return this.crawledData;
  }
}

module.exports = Crawler;
