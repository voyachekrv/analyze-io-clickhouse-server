import { ClickHouseClientConfigOptions } from '@clickhouse/client';

/**
 * Тип конфигурации подключения Clickhouse, приходящий на вход сервиса подключения
 */
export type ClickhouseConfigType =
	| ClickHouseClientConfigOptions
	| Promise<ClickHouseClientConfigOptions>;
