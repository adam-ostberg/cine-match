import { runInAction } from "mobx";

export type PromiseState = {
    promise: any;
    data: any;
    error: any;
}

export function resolvePromise(prms: Promise<any>, promiseState: PromiseState) {
    if (!prms) {
        runInAction(() => {
            promiseState.promise = null;
            promiseState.data = null;
            promiseState.error = null;
        })
        return;
    }
    runInAction(() => {
        promiseState.promise = prms;
        promiseState.data = null;
        promiseState.error = null;
    })

    const thisCall = prms;

    function handleDataACB(data: any) {
        if (promiseState.promise !== thisCall) {
            return;
        }
        runInAction(() => {
            promiseState.data = data;
        })
    }
    function handleErrorACB(err: any) {
        if (promiseState.promise !== thisCall) {
            return;
        }
        runInAction(() => {
            promiseState.error = err
        })
    }
    prms.then(handleDataACB).catch(handleErrorACB);
}