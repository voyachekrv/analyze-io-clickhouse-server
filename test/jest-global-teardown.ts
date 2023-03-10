/* eslint-disable camelcase */
import { createClient } from '@clickhouse/client';
import { config } from 'dotenv';

/**
 * Настройки, производящиеся после окончания процесса тестирования
 */
const jestGlobalTeardown = async () => {
	config({ path: '.env.test' });

	const clickhouseClient = createClient({
		host: `http://${process.env.DATABASE_ADDRESS || 'localhost'}:${
			process.env.DATABASE_PORT || 8123
		}`,
		database: process.env.DATABASE_NAME || 'default_test'
	});

	await clickhouseClient.exec({
		query: `DROP TABLE ${process.env.DATABASE_NAME}.${process.env.DATABASE_TABLE}`,
		clickhouse_settings: {
			wait_end_of_query: 1
		}
	});

	await clickhouseClient.exec({
		query: `DROP TABLE ${process.env.DATABASE_NAME}.migrations`,
		clickhouse_settings: {
			wait_end_of_query: 1
		}
	});
};

export default jestGlobalTeardown;
