

import {createCipheriv,createDecipheriv, randomBytes, scryptSync } from 'crypto'
import md5 from 'md5';
import { v4 as uuid4 } from 'uuid';
import { mWait } from './WaitH';


export enum CryptAlgT {
    RC4 = 'rc4', // ???
    AES256CTR = 'aes-256-ctr', // ???
    AES256CBC = 'aes-256-cbc', // ???
}



/**
 * Шифрование данных
 * @param alg - Алгоритм шифровани
 * @param key - ключ 48 символов
 * @param data - данные для шифрования
 * @returns 
 */
export function mEncrypt(alg:CryptAlgT, key:string, data:string){

    if(key?.length != 48){
        console.log('mEncrypt.key - должен быть 48 символов')
    }
    const pass = key.substr(0,32);
    const iv = key.substr(32,16);

    const vCipher = createCipheriv(alg, pass, iv);

    let sEncrypted = vCipher.update(data, 'utf8', 'hex');
    sEncrypted += vCipher.final('hex');

    return sEncrypted;
}

// Расшифровать
export function mDecrypt(alg:CryptAlgT, key:string, sEncrypted:string,){
    if(key?.length != 48){
        console.log('mDecrypt.key - должен быть 48 символов')
    }
    const pass = key.substr(0,32);
    const iv = key.substr(32,16);

    let sDecrypted = "";
    var vDecipher = createDecipheriv(alg, pass, iv);
    sDecrypted += vDecipher.update(sEncrypted, 'hex', 'utf8');
    sDecrypted += vDecipher.final('utf8');
    return sDecrypted
}

