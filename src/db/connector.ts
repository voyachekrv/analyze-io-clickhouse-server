import { ClickHouse } from 'clickhouse';
import { ClickhouseConfig } from './config';

/**
 * Подключение к БД Clickhouse
 */
export const clickhouse: ClickHouse = new ClickHouse({ ...ClickhouseConfig });
