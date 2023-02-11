import { ClickHouse } from 'clickhouse';
import { ClickhouseConfig } from './config';

/**
 * Применение миграции
 * @param clickhouse Подключение к БД
 */
const up = async (clickhouse: ClickHouse) => {
	await clickhouse
		.query(
			`
	CREATE TABLE default.visit
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
	await clickhouse.query('DROP TABLE default.visit;').toPromise();
};

/**
 * Миграция базы данных
 */
const migrations = async () => {
	const clickhouse: ClickHouse = new ClickHouse({ ...ClickhouseConfig });

	if (process.argv[2] === 'up') {
		await up(clickhouse);
	}

	if (process.argv[2] === 'down') {
		await down(clickhouse);
	}
};

migrations().then();
