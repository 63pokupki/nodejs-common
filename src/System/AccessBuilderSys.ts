/** Построитель прав доступа */
export class AccessBuilderSys {
 
    private vGroup: {sRouteGroup: string, ixMetadata: Record<string, string | number | boolean>, ixRoute: Record<string, boolean>};

    /**  */
    constructor() {
        this.vGroup = { sRouteGroup: '', ixMetadata: {}, ixRoute: {} };
    }

    /**
     * Установить группу маршрутов
     */
    setRouteGroup(sRouteGroup: string) {
        this.vGroup.sRouteGroup = sRouteGroup;
        return this;
    }

    /**
     * Установить метаданные
     */
    setMetadata(ixMetadata: Record<string, string | number | boolean>) {
        this.vGroup.ixMetadata = ixMetadata;
        return this;
    }
    /**
     * Установить роуты
     */
    setRoutes(asRoutes: string[]) {
        for (let i = 0; i < asRoutes.length; i++) {
            const sRoutes = asRoutes[i];
            this.vGroup.ixRoute[sRoutes] = true;
        }
        return this;
    }
    
    /**
     * Создать группу и роуты
     */
    build() {
        return this.vGroup;
    }
}
