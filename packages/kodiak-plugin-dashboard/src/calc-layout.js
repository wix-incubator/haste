module.exports = function calcLayout(panelsAmount) {
  switch (parseInt(panelsAmount, 10)) {
    case 1:
      return {
        grid: { rows: 1, cols: 1 },
        panels: [[0, 0, 1, 1]]
      };
    case 2:
      return {
        grid: { rows: 2, cols: 1 },
        panels: [[0, 0, 2, 1], [0, 1, 2, 1]]
      };
    case 3:
      return {
        grid: { rows: 2, cols: 2 },
        panels: [[0, 0, 1, 1], [0, 1, 1, 1], [1, 0, 1, 2]]
      };
    case 4:
      return {
        grid: { rows: 2, cols: 2 },
        panels: [[0, 0, 1, 1], [0, 1, 1, 1], [1, 0, 1, 1], [1, 1, 1, 1]]
      };
    default:
      return {
        grid: { rows: 2, cols: 2 },
        panels: [[0, 0, 1, 1], [0, 1, 1, 1], [1, 0, 1, 1], [1, 1, 1, 1]]
      };
  }
};
