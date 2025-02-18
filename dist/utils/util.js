"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const Random = (len) => {
    const options = 'jflsjfljal;fj;laskjldksjf;lsjg0rjtoijwlkfjlskjgiajgoilfjslkjgoisrshg';
    let length = options.length;
    let ans = '';
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(((Math.random()) * length))];
    }
    return ans;
};
exports.Random = Random;
