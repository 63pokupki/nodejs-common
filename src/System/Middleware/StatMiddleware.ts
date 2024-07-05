


import { P63Context } from '../P63Context';

// ============= Статистика запросов к core ==========================
let coreRequestRouteCnt: Record<string, number> = {};
let coreRequestGeneralCnt = 0; // Общее количество запросов
let lastReportDatetime = 0;
export default function StatMiddleware(ctx: P63Context): void {

    if(!ctx.sys.monitoringSys){
        ctx.next();
    }

	// ============= Статистика запросов к core ==========================
    const nowDatetime = Date.now();

    let route = String(ctx.req.url);
    if (route.indexOf('?') >= 0) {
        route = route.split('?')[0];
    }

    coreRequestGeneralCnt++;
    if (coreRequestRouteCnt[route]) {
        coreRequestRouteCnt[route] += 1;
    } else {
        coreRequestRouteCnt[route] = 1;
    }
    /** разница в милисекундах */
    const diff = nowDatetime - lastReportDatetime;

    // console.log('time:', nowDatetime.valueOf(), lastReportDatetime, diff);

    // если больше часа, то отправляем в маттермост
    // if (diff > 3600000) {
    if (diff > 360000) {
        try {
            console.log('==============================================================================');
            console.log('Отправка статистики запросов к core за последний час в mattermost');
            console.log('==============================================================================');

            const aMsg = Object.entries(coreRequestRouteCnt);

            for (let i = 0; i < aMsg.length; i++) {
                const vMsg = aMsg[i];
                ctx.sys.monitoringSys.sendInfoApiSuccsess('cnt_request_core:'+process.pid+':'+vMsg[0], {
                    time_start: Date.now(),
                    time_end: Date.now(),
                    val:vMsg[1],
                    msg:'Счетчик по маршруту api'
                });
            }

            ctx.sys.monitoringSys.sendInfoApiSuccsess('cntall_request_core:'+process.pid, {
                time_start: Date.now(),
                time_end: Date.now(),
                val:coreRequestGeneralCnt,
                msg:'Счетчик по api'
            });

    
            lastReportDatetime = Date.now();
            coreRequestRouteCnt = {};
            coreRequestGeneralCnt = 0;
        } catch (error) {
            console.log('==============================================================================');
            console.log('Не удалось отправить статистику запросов к core за последний час в mattermost');
            console.log('==============================================================================');
            lastReportDatetime = Date.now();
            coreRequestRouteCnt = {};
            coreRequestGeneralCnt = 0;
        }
    }

    ctx.next();
}
// ====================================================================