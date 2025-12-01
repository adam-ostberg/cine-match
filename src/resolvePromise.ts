

export type PromiseState = {
    promise: any;
    data: any;
    error: any;
}

export function resolvePromise(prms: Promise<any>, promiseState: PromiseState) {
    if (!prms) {
        promiseState.promise = null;
        promiseState.data = null;
        promiseState.error = null;
        return;
    }
    promiseState.promise = prms;
    promiseState.data = null;
    promiseState.error = null;
    const thisCall = prms;

    function handleDataACB(data: Promise<any>) {
        if (promiseState.promise !== thisCall) {
            return;
        }
        promiseState.data = data;
    }
    function handleErrorACB(err: any) {
        if (promiseState.promise !== thisCall) {
            return;
        }
        promiseState.error = err
    }
    prms.then(handleDataACB).catch(handleErrorACB);
}