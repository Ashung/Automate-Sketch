// TODO: Merge same Symbols

// let a = [1, 2, 3, 3, 4, 4, 1, 4, 5, 1, 4, 2, 9, 1, 1, 1, 1];
// let result = [];


// let _a = a.slice();
// while (_a.length > 0) {
//     let base = _a.shift();
//     console.log(base);
//     let group = [base];
//     console.log(_a);
//     let offset = 0;
//     const _temp = _a.slice();
//     for (let i = 0; i < _temp.length; i++) {
//         if (_temp[i] === base) {
//             group.push(_temp[i]);

//             let item = _a.splice(i - offset, 1);
//             console.log(_a);
//             console.log('--------', i, item);
//             offset ++;
//         }
//     }
//     console.log(group);
//     result.push(group);


// }

// console.log(result);