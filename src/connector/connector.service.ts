import { ClickHouse } from 'clickhouse';

/**
 * Сервис подключений к Clickhouse
 */
export class ConnectorService {
	/**
	 * Экземпляр подключения к Clickhouse
	 */
	private readonly connection: ClickHouse;

	/**
	 * Сервис подключений к Clickhouse
	 * @param properties Параметры подключения
	 */
	constructor(properties: object) {
		this.connection = new ClickHouse(properties);
	}

	/**
	 * Получить экземпляр подключения
	 * @returns Подключение к Clickhouse
	 */
	public getConnection(): ClickHouse {
		return this.connection;
	}
}
