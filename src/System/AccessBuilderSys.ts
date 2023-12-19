/** Построитель прав доступа */
export class AccessBuilderSys {
    // Группа маршрутов
    private sRouteGroup: string = '';
    // Метаданные
    private ixMetadata: Record<string, string | number | boolean> = {};
    // Роуты
    private ixRoute: Record<string, boolean> = {};

    /** Конструктор */
    constructor() {
        this.sRouteGroup = '';
        this.ixMetadata = {};
        this.ixRoute = {};
    }

    /**
     * Установить группу маршрутов
     */
    setRouteGroup(sRouteGroup: string) {
        this.sRouteGroup = sRouteGroup;
        return this;
    }

    /**
     * Установить метаданные
     */
    setMetadata(ixMetadata: Record<string, string | number | boolean>) {
        this.ixMetadata = ixMetadata;
        return this;
    }
    /**
     * Установить роуты
     */
    setRoutes(asRoutes: string[]) {
        for (let i = 0; i < asRoutes.length; i++) {
            const sRoutes = asRoutes[i];
            this.ixRoute[sRoutes] = true;
        }
        return this;
    }
    
    /**
     * Создать группу и роуты
     */
    build(): { sRouteGroup: string, ixMetadata: Record<string, string | number | boolean>, ixRoute: Record<string, boolean> } {
        return { 
            sRouteGroup: this.sRouteGroup, 
            ixMetadata: this.ixMetadata, 
            ixRoute: this.ixRoute 
        };
    }
}
