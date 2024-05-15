

import { LogicSys } from '../LogicSys';
import { CacheSys } from '../CacheSys';
import { AccessSys } from '../AccessSys';
import { P63Context } from '../P63Context';
import { MonitoringSys } from '@63pokupki/monitoring.lib';

/* LEGO ошибок */
export default function SubSysMiddleware(ctx: P63Context): void {
	ctx.sys.logicSys = new LogicSys(ctx); // Система логики
	ctx.sys.cacheSys = new CacheSys(ctx); // Система кеширования

    if(ctx.infrastructure.mqError){
        ctx.sys.monitoringSys = new MonitoringSys(ctx.common.nameApp, ctx.infrastructure.mqError); // Система мониторинга
    }

	ctx.next();
}
