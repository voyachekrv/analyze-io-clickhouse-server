import { ClickHouseClientConfigOptions } from '@clickhouse/client';
import { ConfigService } from '@nestjs/config';

/**
 * Фабрика подключений к Clickhouse
 * @param configService Сервис конфигурации
 * @returns Опции подключения
 */
export const clickhouseClientFactory = (
	configService: ConfigService
): ClickHouseClientConfigOptions => {
	return {
		host: `http://${configService.get<string>(
			'DATABASE_ADDRESS',
			'localhost'
		)}:${configService.get<number>('DATABASE_PORT', 8123)}`,
		database: configService.get<string>('DATABASE_NAME', 'default')
	};
};
