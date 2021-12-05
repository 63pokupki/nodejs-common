import knex, { Knex } from "knex";
import _ from "lodash";

/** описание таблицы для кеширования */
interface CacheI{
    id: number;
    v:number;
    data:string;
    updated_at?:string;
    created_at?:string;
}

/**
 * агрегированное кеширование
 * кеширует данные в денормализованном виде
 * для их быстрой выборки
 * предполагается что кешируемые данные живу
 */
export class AvgCacheSys {

    /** База данных для кеширования */
    dbCache:Knex;

    // TODO - реализовать пул БД для кеширования с распределением данных по ним - на основе деления на остаток

    /** задержка */
    iLatency = 0;

    /** init */
    constructor(conf:Knex.Config){
        if (conf){
            this.dbCache = knex(conf);
        } else {
            console.log('AvgCacheSys - Не указана БД для агрегационного кеширования');
        }
    }

    /** Конфигурация кеширования */
    fConf(param:{
        latency?:number; // Задержка в секундах
    }){
        if (param){
            if (param.latency){
                this.iLatency = param.latency;
            }
        }

    }

    /** Сбросить агрегационные данные */
    async avgReset(sTable:string, aidRecord:number[]){

        if (this.dbCache){
            try {
                await this.dbCache({ t:sTable })
                    .whereIn('t.id', aidRecord)
                    .where('v', '=', 0)
                    .update({ v:1 });
            } catch (e) {
                console.log('AvgCacheSys.avgReset - ', e);
            }
        }
    }


    /**
     * Агрегационное кеширование
     * необходимо передавть фунцию для создания агрегации
     */
    async avgCache<DataT>(sTable:string, aidRecord:number[], callback: (aidRecordDiff:number[]) => Promise<DataT[]>): Promise<DataT[]> {

        let ixCacheIgnore:Record<number, number> = {}; // Словарь для ингорирования кеша, в случае если стоит задержка latency
        let aidRecordDiff:number[] = []; // Разница для выборки новых данных
        let aDataCache:DataT[] = [] // Закешированые данные
        if (this.dbCache){
            const [
                aCache,
                aidCacheIgnore
            ] = await Promise.all([
                this.dbCache<CacheI>({ t:sTable })
                    .whereIn('t.id', aidRecord)
                    .where('t.v', '=', 0)
                    .select()
                ,
                this.dbCache<number[]>({ t:sTable })
                    .whereIn('t.id', aidRecord)
                    .where('t.v', '>', 0)
                    .whereRaw(`NOW() < t.updated_at + INTERVAL ${this.iLatency} SECOND `)
                    .pluck('t.id')
            ]);

            ixCacheIgnore = _.keyBy(aidCacheIgnore);

            // Декодируем данные из кеша
            const aidRecordCache = aCache.map(el => el.id);
            aDataCache = aCache.map((el) => <DataT>JSON.parse(el.data));

            // Вычисляем разницу в данных
            aidRecordDiff = _.difference(aidRecord, aidRecordCache);

            
        }

        const aDataNew:DataT[] = await callback(aidRecordDiff);

        // console.log('[DATA_NEW]>>', 'new:', aDataNew.length, 'dif:', aidRecordDiff.length, 'ign:', aidCacheIgnore.length);

        const aItemCacheNew:CacheI[] = [];
        for (let i = 0; i < aDataNew.length; i++) {
            const vDataNew = aDataNew[i];

            if (vDataNew){
                const idRecord:number = (<any>vDataNew).id;
                aDataCache.push(vDataNew);

                if (!ixCacheIgnore[idRecord]){
                    aItemCacheNew.push({ id: idRecord, v:0,  data: JSON.stringify(vDataNew) });

                }
            }
        }

        if (this.dbCache && aItemCacheNew.length){ // Дописываем данные в кеш
            try {
                // const insertResult = await mgItemCache.insertMany(aItemCacheNew);
                let sql = (this.dbCache(sTable).insert(aItemCacheNew))
                    .toString();

                sql = sql.replace(/^insert/i, 'replace');

                // console.log(sql);
                await this.dbCache.raw(sql);
            } catch (e){
                console.log('AvgCacheSys.avgCache - ', e);
            }
        }

        // Сортировка
        const ixDataCache = _.keyBy(aDataCache, 'id');
        const aDataCacheSort:DataT[] = [];
        for (let i = 0; i < aidRecord.length; i++) {
            const idRecord = aidRecord[i];
            const vDataCache = ixDataCache[idRecord];
            if (vDataCache){
                aDataCacheSort.push(vDataCache);
            }
        }

        return aDataCacheSort;
    }

}