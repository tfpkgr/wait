import Logger from '@tfpkgr/logger';

const log = new Logger().child('@tfpkgr/wait');

/**
 * A utility class for handling promises and delays.
 */
export default class Wait {
	/**
	 * Wraps a promise and catches specified errors.
	 *
	 * @template T - The type of the resolved value of the promise.
	 * @template E - The type of the errors to catch.
	 * @param promise - The promise to execute.
	 * @param errorsToCatch - An optional array of error constructors to catch.
	 * @returns A promise that resolves to a tuple. If an error is caught, the tuple contains `[InstanceType<E>, undefined]`. If the promise resolves successfully, the tuple contains `[undefined, T]`.
	 * @example
	 * const [error, data] = await Wait.promise(promise);
	 * if (error) {
	 *   log.error('Failed to execute promise', error);
	 * }
	 */
	static async promise<T, E extends new (message?: string) => Error>(
		promise: Promise<T>,
		errorsToCatch?: E[],
	): Promise<[InstanceType<E>, undefined] | [undefined, T]> {
		try {
			const data = await promise;
			return [undefined, data] as const;
		} catch (error) {
			log.error('Failed to execute promise', error);

			if (errorsToCatch === undefined) {
				return [error as InstanceType<E>, undefined] as const;
			}

			if (errorsToCatch.some(e => error instanceof e)) {
				return [error as InstanceType<E>, undefined] as const;
			}

			throw error;
		}
	}

	/**
	 * Executes an array of promises and returns their results or errors.
	 *
	 * @template T - The tuple type of the resolved values of the promises.
	 * @template E - The type of the errors to catch.
	 * @param promises - An array of promises to execute.
	 * @param errorsToCatch - An optional array of error constructors to catch.
	 * @returns A promise that resolves to a tuple. The first element is an error if any of the promises fail, otherwise `undefined`. The subsequent elements are the resolved values of the promises.
	 * @example
	 * const [error, result1, result2] = await Wait.all([promise1, promise2]);
	 * if (error) {
	 *   log.error('Failed to execute promises', error);
	 * }
	 */
	static async all<
		T extends unknown[],
		E extends new (message?: string) => Error,
	>(
		promises: {[K in keyof T]: Promise<T[K]>},
		errorsToCatch?: E[],
	): Promise<
		readonly [InstanceType<E>, undefined] | readonly [undefined, ...T]
	> {
		try {
			const results = await Promise.all(promises);
			return [undefined, ...results] as const;
		} catch (error) {
			log.error('Failed to execute promises', error);

			if (errorsToCatch === undefined) {
				return [error as InstanceType<E>, undefined] as const;
			}

			if (errorsToCatch.some(e => error instanceof e)) {
				return [error as InstanceType<E>, undefined] as const;
			}

			throw error;
		}
	}

	/**
	 * Delays execution for a specified number of milliseconds.
	 *
	 * @param ms - The number of milliseconds to wait.
	 * @returns A promise that resolves after the specified delay.
	 * @example
	 * await Wait.time(1000);
	 */
	static async time(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Retries a promise-based function multiple times with a delay between retries.
	 *
	 * @template T - The type of the resolved value of the promise.
	 * @param fn - The function returning a promise to retry.
	 * @param retries - The number of retry attempts.
	 * @param delayMs - The delay in milliseconds between retries.
	 * @returns A promise that resolves to the function's result or rejects after all retries fail.
	 * @example
	 * const result = await Wait.retry(() => fetchData(), 3, 1000);
	 */
	static async retry<T>(
		fn: () => Promise<T>,
		retries: number,
		delayMs: number,
	): Promise<T> {
		let attempt = 0;
		while (attempt < retries) {
			try {
				return await fn();
			} catch (error) {
				attempt++;
				log.warn(
					`Retry attempt ${attempt} failed. Retrying in ${delayMs}ms...`,
					error,
				);
				if (attempt >= retries) {
					log.error('All retry attempts failed.', error);
					throw error;
				}
				await this.time(delayMs);
			}
		}
		throw new Error('Unexpected error in retry logic');
	}
}

export {Wait};
