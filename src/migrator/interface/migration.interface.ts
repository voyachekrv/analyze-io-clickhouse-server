import { QueryResult } from '@clickhouse/client/dist/connection';

/**
 * Миграция базы данных
 */
export interface IMigration {
	/**
	 * Применение миграции
	 */
	up(): Promise<QueryResult>;

	/**
	 * Откат миграции
	 */
	down(): Promise<QueryResult>;
}
