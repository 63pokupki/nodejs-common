/** Построитель прав доступа */
export class AccessBuilderSys {
 
    private vGroup: {sRouteGroup: string, ixRoute: Record<string, boolean>};

	/**  */
    constructor() {
        this.vGroup = { sRouteGroup: '', ixRoute: {} };
    }

    /**
     * Установить группу маршрутов
     */
    setRouteGroup(sRouteGroup: string) {
        this.vGroup.sRouteGroup = sRouteGroup;
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
    build(): {sRouteGroup: string, ixRoute: Record<string, boolean>} {
        return this.vGroup;
    }
}

