const blessed = require('blessed');

module.exports = class Panel {
  constructor({ label, width, height, left, top }) {
    this.label = label;
    this.width = width;
    this.height = height;
    this.left = left;
    this.top = top;
    this.text = '';
    this.screen;
  }

  log(log) {
    this.text = `${this.text}\n${log}`;
    this.update();
  }

  clear() {
    this.text = '';
    this.update();
  }

  update() {
    if (!this.screen) return;
    this.box.setContent(this.text);
    this.box.setScrollPerc(100);
    this.screen.render(); // Todo here
  }

  render(screen) {
    if (this.screen) throw new Error('screen is already rendered');

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
      label: this.label,
      padding: 1,
      width: this.width,
      height: this.height,
      left: this.left,
      top: this.top,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'white'
        }
      }
    });

    this.box = box;
    this.screen = screen;
    screen.append(box);

    this.update();
  }
};
