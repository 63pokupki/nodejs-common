
import { RabbitSenderSys } from '../src/System/RabbitSenderSys';
const config = require('./config.js');

async function run() {
    const rabbitSenderSys = await RabbitSenderSys.Init(config.rabbit.connection, config.rabbit.queryList); // Отправщик картинок в очередь

    rabbitSenderSys.sendToQueue(
        's3_item_img', {
        filename: '2134123123',
        source_url: 'https://www.desktopbackground.org/download/1440x900/2014/02/07/713331_beautiful-nature-wallpapers-hd_1504x940_h.jpg'
    }
    );
    let data = await rabbitSenderSys.checkQueue('s3_item_img');

    console.log(data);;

}
run();
