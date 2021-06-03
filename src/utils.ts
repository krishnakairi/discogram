export const promiseWhile = (action, condition, limit = 10) => {
    let counter = 1;
    const action$ = (d, w) => {
        counter += 1;
        return action(d).then(w);
    };
    const condition$ = ($d) => {
        const cond = (counter !== 1) ? (condition($d) && counter <= limit) : true;
        return cond;
    };
    const whilst = ($data?) => {
        const wh = (condition$($data)) ?
            action$($data, whilst) :
            Promise.resolve($data);
        return wh;
    };
    return whilst();
};

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
