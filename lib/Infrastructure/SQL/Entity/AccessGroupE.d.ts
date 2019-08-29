/**
 * WorldFasa
 *
 * @ORM\Table(name="access_group")
 * @ORM\Entity
 */
export declare class AccessGroupE {
    NAME: string;
    /**
     * Обновление ключевых записей таблицы
     */
    getRulesUpdate(): {
        [key: string]: any;
    };
    /**
     *  Правила создания записей в таблице
     */
    getRulesInsert(): {
        [key: string]: any;
    };
}
