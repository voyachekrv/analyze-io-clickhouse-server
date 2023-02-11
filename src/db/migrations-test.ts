import { ClickHouse } from 'clickhouse';
import { ClickhouseTestConfig } from './test-config';

/**
 * Применение миграции
 * @param clickhouse Подключение к БД
 */
const up = async (clickhouse: ClickHouse) => {
	await clickhouse
		.query(
			`
	CREATE TABLE default.visit_test
	(
		id String,
		createdAt DateTime,
		shopId String,
		ip String,
		visitorId String,
		item String,
		price Float64,
		priceCurrency String
	)
	ENGINE = MergeTree
	PRIMARY KEY id
	ORDER BY id
	SETTINGS index_granularity = 8192;
	`
		)
		.toPromise();
};

/**
 * Откат миграции
 * @param clickhouse Подключение к БД
 */
const down = async (clickhouse: ClickHouse) => {
	await clickhouse.query('DROP TABLE default.visit_test;').toPromise();
};

/**
 * Миграция тестовой базы данных
 */
const migrationsTest = async () => {
	const clickhouse: ClickHouse = new ClickHouse({ ...ClickhouseTestConfig });

	if (process.argv[2] === 'up') {
		await up(clickhouse);
	}

	if (process.argv[2] === 'down') {
		await down(clickhouse);
	}
};

migrationsTest().then();
