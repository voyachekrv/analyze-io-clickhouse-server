import {
	ClickHouseClient,
	ClickHouseClientConfigOptions,
	ExecParams,
	InsertParams,
	QueryParams,
	ResultSet,
	createClient
} from '@clickhouse/client';
import { InsertResult, QueryResult } from '@clickhouse/client/dist/connection';
import { ClickhouseConfigType } from './clickhouse-config.type';
import { Logger } from '@nestjs/common';

/**
 * Сервис подключения к Clickhouse
 */
export class ClickhouseService {
	/**
	 * Экземпляр клиента Clickhouse
	 */
	private client: ClickHouseClient;

	/**
	 * Сервис подключения к Clickhouse
	 * @param config Конфиг подключения к базе данных
	 */
	constructor(config: ClickhouseConfigType) {
		this.connect(config).then();
	}

	/**
	 * Подключение к Clickhouse
	 * @param config Конфиг подключения
	 */
	private async connect(config: ClickhouseConfigType) {
		try {
			if (config && typeof config['then'] === 'function') {
				this.client = createClient(await config);
			} else {
				this.client = createClient(
					config as ClickHouseClientConfigOptions
				);
			}

			if (await this.client.ping()) {
				Logger.log(
					'Successfully connected to Clickhouse',
					this.constructor.name
				);
			}
		} catch (e) {
			Logger.error(e, this.constructor.name);
			await this.client.close();

			setTimeout(async () => {
				await this.connect(config);
			}, 3000);
		}
	}

	/**
	 * Получение экземпляра клиента Clickhouse
	 * @returns Экземпляр клиента
	 */
	public getClient(): ClickHouseClient {
		return this.client;
	}

	/**
	 * Запрос на выборку из БД
	 * @param params Параметры запроса
	 * @returns Набор результатов запроса
	 */
	public async query(params: QueryParams): Promise<ResultSet> {
		return await this.client.query(params);
	}

	/**
	 * Запрос, не возвращающий данных непосредственно из БД
	 * @param params Параметры запроса
	 * @returns Результат запроса
	 */
	public async exec(params: ExecParams): Promise<QueryResult> {
		return await this.client.exec(params);
	}

	/**
	 * Вставка данных в БД
	 * @param params Параметры вставки
	 * @returns Результат вставки
	 */
	public async insert<T>(params: InsertParams<T>): Promise<InsertResult> {
		return await this.client.insert(params);
	}

	/**
	 * Проверка целостности соединения с базой данных
	 * @returns Есть ли соединение с базой данных
	 */
	public async ping(): Promise<boolean> {
		return await this.ping();
	}

	/**
	 * Закрытие соединения с базой данных
	 */
	public async close(): Promise<void> {
		await this.client.close();
	}
}
