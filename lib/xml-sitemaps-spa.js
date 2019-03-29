const Crawler = require('./crawler');
const XmlBuilder = require('./xml-builder');

class XmlSitemapsSpa {
  constructor(
    url, options = {}
  ) {
    this.url = url;
    this.lastModified = options.hasOwnProperty('lastModified') ? options.lastModified : false;
    this.changeFrequency = options.hasOwnProperty('changeFrequency') ? options.changeFrequency : false;
    this.priority = options.hasOwnProperty('priority') ? options.priority : false;
    this.limit = options.hasOwnProperty('limit') ? options.limit : 0;
    this.exclude = options.hasOwnProperty('exclude') ? options.exclude : [];
    this.log = options.hasOwnProperty('log') ? true : false;
    this.output = options.hasOwnProperty('output') ? options.output : false;
  }

  async generate() {
    const crawler = new Crawler(this.limit, this.exclude, this.log);

    const crawledData = await crawler.crawl(this.url);

    const xmlContent = XmlBuilder.getContent(crawledData, this.lastModified, this.changeFrequency, this.priority);

    if (!this.output) {
      return xmlContent;
    }

    return await XmlBuilder.createXmlFile(this.output, xmlContent);
  }
}

module.exports = XmlSitemapsSpa;
