const blessed = require('blessed');
const calcLayout = require('./calc-layout');

const DEFAULT_SCROLL_OPTIONS = {
  scrollable: true,
  input: true,
  alwaysScroll: true,
  scrollbar: {
    ch: ' ',
    inverse: true
  },
  keys: true,
  vi: true,
  mouse: true
};

module.exports = class Dashboard {
  constructor() {
    this.panels = {};
    this.screen;
  }

  init({ panels }) {
    // configure screen
    this.screen = blessed.screen({
      title: '',
      // title: `kodaik-dashboard${cmd ? ` - running ${cmd} command` : ''}`,
      smartCSR: true,
      dockBorders: false,
      fullUnicode: true,
      autoPadding: true
    });

    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    // establish layout
    const panelsAmount = panels;
    this.layout = calcLayout(panelsAmount);
    this.i = 0;

    // layout.forEach(([width, height, left, top], i) => {
    //   const taskName = tasks[i];
    //   this.createPanel({ width, height, left, top, label: taskName, panelKey: taskName });
    // });

    this.screen.render();
  }

  createPanel({ panelKey, label }) {
    const i = this.i;

    const [width, height, left, top] = this.layout[i];

    const box = blessed.box({
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

    const logger = blessed.log(
      Object.assign({}, DEFAULT_SCROLL_OPTIONS, {
        parent: box,
        tags: true,
        width: '100%-4'
      })
    );

    this.screen.append(box);
    this.panels[panelKey] = logger;
    this.i += 1;

    return this.getLogger(panelKey);
  }

  getLogger(panelKey) {
    return (message) => {
      if (!this.panels[panelKey]) return;
      message.split('\n').forEach((sentence) => {
        this.panels[panelKey].log(sentence);
      });
    };
  }
};

