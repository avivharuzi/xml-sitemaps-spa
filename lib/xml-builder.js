const convert = require('xml-js');
const fs = require('fs');

const XmlItem = require('./xml-item');

class XmlBuilder {
  static getContent(dataUrls, lastModified, changeFrequency, priority) {
    let elements = [];

    for (let dataUrl of dataUrls) {
      if (!lastModified) {
        lastModified = dataUrl.lastModified;
      }

      let xmlItem = new XmlItem(dataUrl.url, lastModified, changeFrequency, priority);

      elements.push(xmlItem.getElements());
    }

    let data = {
      declaration: {
        attributes: {
          version: '1.0',
          encoding: 'UTF-8'
        }
      },
      elements: [{
        type: 'element',
        name: 'urlset',
        attributes: {
          xmlns: 'https://www.sitemaps.org/schemas/sitemap/0.9',
        },
        elements: [
          ...elements
        ]
      }]
    };

    return convert.js2xml(data, {
      ignoreComment: true,
      spaces: 2
    });
  }

  static createXmlFile(output, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(output + 'sitemap.xml', data, (err) => {
        if (err) {
          reject(err);
        }

        resolve(output);
      });
    });
  }
}

module.exports = XmlBuilder;
