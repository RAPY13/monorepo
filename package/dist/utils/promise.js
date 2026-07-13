import { debug, error } from "../adapters/logger";
/**
 * A `Promise.withResolvers` implementation that exposes the `resolve` and
 * `reject` functions on a `Promise`.
 * Copied from next https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/detached-promise.ts
 * @see https://tc39.es/proposal-promise-with-resolvers/
 */
export class DetachedPromise {
    resolve;
    reject;
    promise;
    constructor() {
        let resolve;
        let reject;
        // Create the promise and assign the resolvers to the object.
        this.promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        // We know that resolvers is defined because the Promise constructor runs
        // synchronously.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.resolve = resolve;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.reject = reject;
    }
}
export class DetachedPromiseRunner {
    promises = [];
    withResolvers() {
        const detachedPromise = new DetachedPromise();
        this.promises.push(detachedPromise);
        return detachedPromise;
    }
    add(promise) {
        const detachedPromise = new DetachedPromise();
        this.promises.push(detachedPromise);
        promise.then(detachedPromise.resolve, detachedPromise.reject);
    }
    async await() {
        debug(`Awaiting ${this.promises.length} detached promises`);
        const results = await Promise.allSettled(this.promises.map((p) => p.promise));
        const rejectedPromises = results.filter((r) => r.status === "rejected");
        rejectedPromises.forEach((r) => {
            error(r.reason);
        });
    }
}
