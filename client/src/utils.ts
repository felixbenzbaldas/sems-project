export async function wait(milliseconds : number) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function notNullUndefined(toCheck : any) {
    return toCheck != null && toCheck != undefined;
}