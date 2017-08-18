// module.exports = ({ concurrency }) => {
//   const queue = [];
//   let size = 0;

//   function processQueue() {
//     if (queue.length > 0 && size < concurrency) {
//       const task = queue.shift();

//       return Promise.resolve()
//         .then(() => size += 1)
//         .then(() => task())
//         .then(() => size -= 1)
//         .then(() => processQueue());
//     }

//     return Promise.resolve();
//   }

//   return {
//     push: (task) => {
//       const promise = Promise.resolve()
//         .then(() => queue.push(task));

//       promise
//         .then(() => processQueue());

//       return promise;
//     }
//   };
// };
