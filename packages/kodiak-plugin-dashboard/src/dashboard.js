const blessed = require('blessed');
const contrib = require('blessed-contrib');
const path = require('path');
const calcLayout = require('./calc-layout');

module.exports = class Dashboard {
  constructor() {
    this.panels = {};
  }

  init({ maxPanels = 4, tasks }) {
    // configure screen
    const screen = blessed.screen({ smartCSR: true });
    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    // establish layout
    const panelsAmount = tasks.length < maxPanels ? tasks.length : maxPanels;
    const layout = calcLayout(panelsAmount);

    const grid = new contrib.grid({ // eslint-disable-line
      rows: layout.grid.rows,
      cols: layout.grid.rows,
      screen
    });

    layout.panels.forEach(([row, col, rowSpan, colSpan], i) => {
      const taskName = tasks[i];
      const taskRelativePath = path.relative('./', taskName); // TODO - remove when there is name
      const panel = grid.set(row, col, rowSpan, colSpan, blessed.log, { label: taskRelativePath });
      this.panels[taskName] = panel;
    });

    screen.render();
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
