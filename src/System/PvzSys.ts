export class PvzSys {
	private idPvz: number;

	public constructor() {
		this.idPvz = 0;
	}

	/** Получить ID ПВЗ */
	public fGetPvzID(): number {
		return this.idPvz;
	}

	/** Установить ID ПВЗ */
	public fSetPvzID(value: number): void {
		this.idPvz = value;
	}
}