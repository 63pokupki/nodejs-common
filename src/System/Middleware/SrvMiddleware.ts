



/**
 * Ответ декодиирования тикена
 * Должен обновляться каждую неделю
 * Время действия токена 1 месяц
 * Если пользователь постоянно пользуется сайтом у него будет ощущение бесконечного токена
 * Токен скрыто обновляется если он старше 1 недели
 */

import _ from "lodash";
import { mDecrypt } from "../../Helpers/CryptoH";
import { mJwtDecode } from "../../Helpers/JwtH";
import { P63Context } from "../P63Context";

/** проверка аутентификации на уровне приложения */
export default async function SrvMiddleware(ctx:P63Context): Promise<void> {
    const srvkey = String(ctx.headers.apikey);
    ctx.sys.srvkey = srvkey;
    let bOk = true;

    if(!ctx.sys.srvkey || ctx.sys.srvkey?.length > 10000){ // Проверка наличия серверного ключа
        bOk = false;
    }
    if(bOk){ // Проверить IP
        bOk = ctx.srv.ipPool.includes(ctx.req.socket.remoteAddress);
    }

    let asSrvKeyInput:string[] = [];
    if(bOk && srvkey){
        try{
            asSrvKeyInput = mJwtDecode<string[]>({
                jwt:mDecrypt(
                    ctx.srv.cry.algorithm,
                    ctx.srv.cry.key,
                    srvkey
                ),
                algorithm:ctx.srv.jwt.algorithm,
                secret:ctx.srv.jwt.jwtKey
            });

        } catch(e){
            bOk = false;
            console.log('!!!ERROR!!!>>>', 'Не удалось расшифровать srvkey - ', ctx.req.socket.remoteAddress);
        }
    }
    
    if(bOk){ // проверяем ключи
        const asKeyValid = _.intersection(ctx.srv.keyPool, asSrvKeyInput)
        
        if(!asKeyValid || asKeyValid?.length < 5){
            bOk = false;
        }
    }

    ctx.sys.bSrv = false; // Проверка сервера
    if(bOk){
        ctx.sys.bSrv = true;
    }

    ctx.next();
}
