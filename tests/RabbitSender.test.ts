let config= {
    rabbit:{
        connection:'amqp://devs3.63pokupki.ru:5672',
        queryList:['queue1']
    }
};
import { RabbitSender } from '../src/System/RabbitSenderSys';

async function run(){
    const rabbitSenderSys = await RabbitSender.Init(config.rabbit.connection, config.rabbit.queryList); // Отправщик картинок в очередь
    console.log(rabbitSenderSys.aQuery);
}
run();
