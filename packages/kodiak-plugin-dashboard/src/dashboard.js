const blessed = require('blessed');
const path = require('path');
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

  init({ maxPanels = 4, tasks, cmd }) {
    // configure screen
    this.screen = blessed.screen({
      title: `kodaik-dashboard${cmd ? ` - running ${cmd} command` : ''}`,
      smartCSR: true,
      dockBorders: false,
      fullUnicode: true,
      autoPadding: true
    });

    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    // establish layout
    const panelsAmount = tasks.length < maxPanels ? tasks.length : maxPanels;
    const layout = calcLayout(panelsAmount);

    layout.forEach(([width, height, left, top], i) => {
      const taskName = tasks[i];
      const taskRelativePath = path.relative('./', taskName); // TODO - remove when there is name
      this.createPanel({ width, height, left, top, label: taskRelativePath, panelKey: taskName });
    });

    this.screen.render();
  }

  createPanel({ panelKey, label, width, height, left, top }) {
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

