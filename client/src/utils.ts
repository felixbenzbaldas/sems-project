export async function wait(milliseconds : number) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function notNullUndefined(toCheck : any) {
    return toCheck != null && toCheck != undefined;
}

export function getPromiseAndResolver() : {resolve : () => void, promise : Promise<void>} {
    let resolve : () => void;
    let promise = new Promise<void>(_resolve => {
        resolve = _resolve;
    });
    return {
        resolve: resolve,
        promise: promise
    };
}