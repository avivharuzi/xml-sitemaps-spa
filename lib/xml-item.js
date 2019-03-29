class XmlItem {
  constructor(url, lastModified, changeFrequency, priority) {
    this.url = url;
    this.lastModified = lastModified;
    this.changeFrequency = changeFrequency;
    this.priority = priority;
  }

  getElements() {
    let elements = [];

    if (this.url) {
      elements.push({
        ...this.getElement('loc', this.url)
      });
    }

    if (this.lastModified) {
      elements.push({
        ...this.getElement('lastmod', this.lastModified)
      });
    }

    if (this.changeFrequency) {
      elements.push({
        ...this.getElement('changefreq', this.changeFrequency)
      });
    }

    if (this.priority) {
      elements.push({
        ...this.getElement('priority', this.priority)
      });
    }

    return {
      type: 'element',
      name: 'url',
      elements: elements
    };
  }

  getElement(name, text) {
    return {
      type: 'element',
      name: name,
      elements: [{
        type: 'text',
        text: text
      }]
    };
  }
}

module.exports = XmlItem;
