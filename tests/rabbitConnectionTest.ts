import { rabbitSender } from "../src/System/RabbitSenderSys";
export const rabbit = {

	// Список очередей которые будут подняты
	queryList: [
		's3_item_img', // Очередь для картинок каталога
		's3_item_img_do', // Очередь для картинок каталога на DO
		's3_item_img_migrate',
		'item_characteristic',
		'item_bundle',
		'print_check',
		's3_item_img_migrate', // временная очередь для миграции по архивным картинкам
		'order_transit', // Транзит заказов в ПВЗ
	],

	// Соединение с кроликом
	connection: 'amqp://127.0.0.1:5672?heartbeat=2',
};

// Отправщик картинок в очередь;

async function run() {
	await rabbitSender.Init(rabbit.connection, rabbit.queryList);
} run();