import { ClickHouseClientConfigOptions } from '@clickhouse/client';
import { config } from 'dotenv';

/**
 * Опции подключения мигратора к аналитической БД
 * @param envFile Путь к файлу переменных окружения с настройками БД
 * @returns Опции подключения
 */
export const connectorOptions = (
	envFile: string
): ClickHouseClientConfigOptions => {
	config({ path: envFile });

	return {
		host: `http://${process.env.DATABASE_ADDRESS || 'localhost'}:${
			process.env.DATABASE_PORT || 8123
		}`,
		database: process.env.DATABASE_NAME || 'default'
	};
};
