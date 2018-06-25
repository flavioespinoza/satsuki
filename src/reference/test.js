
/** (1) How do I correctly use setInterval
 *  (2) and clearInterval
 *  (3) to switch between two different functions?
 *
 */

/** Tools */
const log = require('ololog').configure({
  locate: false
})

const _ = require('lodash')

// let count = 0
// let interval__UP
// let interval__DOWN
//
// function countUp () { /** (3) first function */
//
//   count++
//
//   log.lightBlue('countUp(): ', count)
//
//   if (count == 9) { /** When count reaches 9 we clear the current interval which counts up. */
//
//     /** (2) clear interval which stops the count  */
//     clearInterval(interval__UP)
//
//
//     interval__DOWN = setInterval(function () {
//       countDown()
//     }, 1000)
//   }
//
// }
//
// function countDown () { /** (4) second function */
//
//   count--
//
//   log.lightRed('countDown(): ', count)
//
//   if (count == 0) {
//     clearInterval(interval__DOWN)
//     interval__UP = setInterval(function () {
//       countUp()
//     }, 1000)
//   }
// }
//
// function start () {
//
//   log.cyan('start()')
//   countUp() /** (3) start the first function counting up */
//
//   /** (1) initial setInterval  */
//   interval__UP = setInterval(function () {
//
//     countUp() /** (3) continuation of the first function running at a 2 sec interval */
//
//   }, 1000)
// }
//
// start()

// const fibonacci = _.memoize(function(n) {
//   log.green('n', n)
//   return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
// });
//
// let x = fibonacci(5)
// let y = fibonacci(5)
// let z = fibonacci(5)
//
// console.log('x', x)
// console.log('y', x)
// console.log('y', x)
//
// const arr = [1, 2, 3, 4, 5];
//
// log.cyan(arr.splice(0, 3))
// //=> [1, 2, 3]
//
// log.blue(arr.splice(0, 3))
// //=> [1, 2, 3]
//
// log.yellow(arr.splice(0, 3))
// //=> [1, 2, 3]
//
// log.red(arr);
// //=> [1, 2, 3, 4, 5]

let x = 2
let y = 8
const a = function (b) {
  return function (c) {
    return x + y + Math.abs(b) + c
  }
}

// Statement will go here
y = 4

const fn = a(x)
x = 4
log.cyan(fn(Math.random() * 10))