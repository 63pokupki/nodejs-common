
import { verify, sign } from 'jsonwebtoken';

export interface JwtDecodeI {
    data?: any; // данные
    iat?: number; // время создания токена
    exp?: number; // время действия токена
}

export enum JwtAlgT {
    HS256='HS256', //	HMAC using SHA-256 hash algorithm
    HS384='HS384', //	HMAC using SHA-384 hash algorithm
    HS512='HS512', //	HMAC using SHA-512 hash algorithm
    RS256='RS256', //	RSASSA-PKCS1-v1_5 using SHA-256 hash algorithm
    RS384='RS384', //	RSASSA-PKCS1-v1_5 using SHA-384 hash algorithm
    RS512='RS512', //	RSASSA-PKCS1-v1_5 using SHA-512 hash algorithm
    PS256='PS256', //	RSASSA-PSS using SHA-256 hash algorithm (only node ^6.12.0 OR >=8.0.0)
    PS384='PS384', //	RSASSA-PSS using SHA-384 hash algorithm (only node ^6.12.0 OR >=8.0.0)
    PS512='PS512', //	RSASSA-PSS using SHA-512 hash algorithm (only node ^6.12.0 OR >=8.0.0)
    ES256='ES256', //	ECDSA using P-256 curve and SHA-256 hash algorithm
    ES384='ES384', //	ECDSA using P-384 curve and SHA-384 hash algorithm
    ES512='ES512', //	ECDSA using P-521 curve and SHA-512 hash algorithm
}

/**
 * Декодирование jwt токена
 * @param param - данные для расшифровки
 */
export function mJwtDecode<T>(param:{
    jwt:string;
    secret:string;
    algorithm:JwtAlgT;
}): T {
    let decodedJwt:JwtDecodeI = null;
    let dataJwt:T = null;
    try {
        decodedJwt = <any>verify(param.jwt, param.secret, { algorithms: [param.algorithm] });
    } catch (e) {
        decodedJwt = null;
    }

    // Проверяем что прошло меньше месяца
    if (decodedJwt) {
        // Проверяем время жизни токена
        if (Date.now() / 1000 < decodedJwt.exp) {
            dataJwt = decodedJwt.data;
        }
    }

    return dataJwt;
}

/**
 * jwt кодирование
 * @param param - данные для подписи
 */
 export function mJwtEncode(param:{
    data:any; // данные
    secret:string; // секрет ключ
    algorithm:JwtAlgT; // алгоритм
    exp:number; // время жизни в секундах
    deviation:number; // погрешность минуты
}): string {
    
    let iDeviation = 0;
    if(param.deviation){
        iDeviation = 60 * param.deviation;
    }
    const sJwt = sign(
        {
            data: param.data,
            iat: Math.floor(Date.now() / 1000) - iDeviation, // создаетм jwt задним числом - 15 минут
        },
        param.secret,
        {
            algorithm: param.algorithm,
            expiresIn: param.exp + iDeviation, // Длительность
        }
    );

    return sJwt;
}