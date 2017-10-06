const blessed = require('blessed');
const calcLayout = require('./calc-layout');
const Panel = require('./panel');

module.exports = class Dashboard {
  constructor({ maxPanels = 4, tasks }) {
    this.panels = {};
    this.screen;
    this.maxPanels = maxPanels;
    this.tasks = tasks;
  }

  render() {
    const cmd = '';
    // configure screen
    this.screen = blessed.screen({
      title: `haste-dashboard${cmd ? ` - running ${cmd} command` : ''}`,
      smartCSR: true,
      dockBorders: false,
      fullUnicode: true,
      autoPadding: true
    });

    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    // establish layout
    const panelsAmount = this.tasks.length < this.maxPanels ? this.tasks.length : this.maxPanels;
    const layout = calcLayout(panelsAmount);

    layout.forEach(([width, height, left, top], i) => {
      const taskName = this.tasks[i];
      this.addPanel({ width, height, left, top, label: taskName, panelKey: taskName });
    });

    this.screen.render();
  }

  addPanel({ panelKey, label, width, height, left, top }) {
    const panel = Panel.create({ screen: this.screen, label, width, height, left, top });
    this.panels[panelKey] = panel;
  }

  getPanel(panelKey) {
    if (!this.panels[panelKey]) return null;
    return this.panels[panelKey];
  }

  getLogger(panelKey) {
    return (log) => {
      if (!this.panels[panelKey]) return null;
      return this.panels[panelKey].log(log);
    };
  }
};
