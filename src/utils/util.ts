
export const Random = (len: number)=>{

    const options = 'jflsjfljal;fj;laskjldksjf;lsjg0rjtoijwlkfjlskjgiajgoilfjslkjgoisrshg'
    let length = options.length;

    let ans = '';

    for(let i=0; i<len; i++){
        ans += options[Math.floor(((Math.random())*length))]
    }

    return ans;
}