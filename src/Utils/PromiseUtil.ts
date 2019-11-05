
export function promisify<T>(someResult: Promise<T> | T): Promise<T> {
	if (someResult instanceof Promise) {
		return someResult;
	}
	return Promise.resolve(someResult as T);
}
