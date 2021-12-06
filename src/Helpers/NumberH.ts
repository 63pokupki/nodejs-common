
/**
 * Генерация случайного числа в между двумя числами включительно
 * @param min
 * @param max
 */
export function mRandomInteger(min: number, max: number): number {
    // случайное число от min до (max+1)
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
