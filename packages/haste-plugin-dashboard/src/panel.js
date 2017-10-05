const blessed = require('blessed');

module.exports = class Panel {
  constructor({ box, screen }) {
    this.box = box;
    this.screen = screen;
    this.text = '';
  }

  log(log) {
    this.text = `${this.text}\n${log}`;
    this.box.setContent(this.text);
    this.screen.render();
  }

  clear() {
    this.text = '';
    this.box.setContent(this.text);
    this.screen.render();
  }

  changeBorderColor(color) {
    this.box.style.border.fg = color;
  }

  static create({ screen, label, width, height, left, top }) {
    const box = blessed.box({
      scrollable: true,
      input: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        inverse: true
      },
      keys: true,
      vi: true,
      mouse: true,
      label,
      padding: 1,
      width,
      height,
      left,
      top,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'white'
        }
      }
    });

    // const logger = blessed.log(
    //   Object.assign({}, DEFAULT_SCROLL_OPTIONS, {
    //     parent: box,
    //     tags: true,
    //     width: '100%-4'
    //   })
    // );

    screen.append(box);
    return new Panel({ screen, box });
  }
};
