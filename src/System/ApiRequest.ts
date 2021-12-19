

import axios from 'axios';
import https from 'https';
import { mEncrypt } from '../Helpers/CryptoH';
import { mJwtEncode } from '../Helpers/JwtH';
import { P63Context } from './P63Context';

// для https соединения
const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // (NOTE: this will disable client verification)
});

/** Ключ для межсерверного запроса */
let sKeySrv:string = '';

/** Получить srvkey */
function fSrvKey(ctx:P63Context){
    if (!sKeySrv){
        sKeySrv = mEncrypt(
            ctx.srv.cry.algorithm,
            ctx.srv.cry.key,
            mJwtEncode({
                data:ctx.srv.keyPool,
                secret:ctx.srv.jwt.jwtKey,
                algorithm:ctx.srv.jwt.algorithm,
                exp:ctx.srv.jwt.exp,
                deviation:15
            })
        );
    }

    return sKeySrv;
}


/**
 * Заголовки для запроса к API
 * @param req
 */
const fApiHeaders = (ctx: P63Context) => ({
    headers: {
        srvkey: fSrvKey(ctx),
        apikey: ctx.sys.apikey,
    },
    timeout: 20000,
    httpsAgent
});

/**
 * Формат ответа от API
 */
interface ApiResponseI {
    ok: boolean;
    e: boolean;
    data: any;
    msg: string;
    errors: [];
}

/**
 * Формирование запроса к API
 * @param sUrl - относительный url
 * @param ctx -
 * @param data - данные для запроса
 */
export async function faApiRequest<T>(
    ctx: P63Context, // Контекст
    sUrl: string, // Путь
    data: any, // Данные
): Promise<T> {


    let resp: ApiResponseI = {
        ok: false,
        data: null,
        e: true,
        msg: '',
        errors: [],
    };

    let respData:T = null;
    try {
        resp = (await axios.post(
            sUrl,
            data,
            fApiHeaders(ctx)
        )).data;

        if(resp?.ok){
            respData = resp.data
        }
    } catch (e) {
        respData = e.response.data;
    }

    return respData;
};