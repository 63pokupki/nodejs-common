/**
 * задержка на нужное кол-во секунд
 * @param n
 */
export function wait(n: number): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, n);
	});
}
