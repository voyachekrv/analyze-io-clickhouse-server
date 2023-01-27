import { clickhouse } from './connector';

const migrations = async () => {
	await clickhouse
		.query(
			`
	CREATE TABLE default.visit
	(
		id String,
		createdAt DateTime,
		traderId String,
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

migrations().then();
