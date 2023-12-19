// Интерфейс метаданных группы маршрутов
export interface MetadataI{
    action_name: string;    // Тип действия
    page_name: string;      // Название страницы
    section_name: string;   // Название раздела
    description: string;    // Описание
}

/** Построитель прав доступа */
export class AccessBuilderSys {
    // Группа маршрутов
    private sRouteGroup: string;
    // Метаданные
    private vMetadata: MetadataI;
    // Роуты
    private ixRoute: Record<string, boolean>;

    /** Конструктор */
    constructor() {
        this.sRouteGroup = '';
        this.vMetadata = {
            action_name: '',
            page_name: '',
            section_name: '',
            description: ''
        };
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
    setMetadata(vMetadata: MetadataI) {
        this.vMetadata = { ...vMetadata };
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
    build(): { sRouteGroup: string, vMetadata: MetadataI, ixRoute: Record<string, boolean> } {
        return { 
            sRouteGroup: this.sRouteGroup, 
            vMetadata: this.vMetadata, 
            ixRoute: this.ixRoute 
        };
    }
}
