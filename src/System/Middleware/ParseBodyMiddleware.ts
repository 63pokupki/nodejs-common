import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { P63Context } from '../P63Context';
import colors from 'colors';


/* LEGO ошибок */
export default function ParseBodyMiddleware(ctx: P63Context): void {
	if (ctx.req.method === 'POST' ){
        if (ctx.req.headers['content-length'] && Number(ctx.req.headers['content-length']) < 40 * 1024 * 1024 ){
            const body:Buffer[] = [];

            ctx.req.on('error', (err) => {
                console.error(colors.red('Ошибка парсинга тела запроса - '), ctx.req.url, err);
                ctx.error(400);
            });

            ctx.req.on('data', (chunk:Buffer) => {
                body.push(chunk);
            });

            ctx.req.on('end', () => {

                let sBody = Buffer.concat(body).toString();

                try {
                    if (sBody && sBody[0] === '{'){
                        ctx.body = JSON.parse(sBody);
                    } else {
                        sBody = decodeURI(sBody);
                        const vSearchParams = new URLSearchParams(sBody);

                        // Итерируем параметры form параметры поиска.
                        for (const p of vSearchParams) {
                            const kBodyParam = p[0];
                            const vBodyParam = p[1];

                            if (kBodyParam == 'data'){ // Если встречаем в form param [data] парсим ее как json
                                ctx.body[kBodyParam] = JSON.parse(vBodyParam);
                            } else {
                                ctx.body[kBodyParam] = vBodyParam;
                            }
                        }

                    }
                } catch (e){
                    console.error(colors.red('Ошибка парсинга тела запроса - '), ctx.req.url);
                    ctx.error(400);
                }

            });
        } else {
            console.error(colors.red('Размер запроса слишком большой - '), ctx.req.url);
            ctx.error(400);
        }
    }

    ctx.next();
}
