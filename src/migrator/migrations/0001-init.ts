/* eslint-disable camelcase */

import { QueryResult } from '@clickhouse/client/dist/connection';
import { IMigration } from '../interface/migration.interface';
import { config } from 'dotenv';
import { ClickHouseClient, createClient } from '@clickhouse/client';
import { connectorOptions } from '../connector-options';

export class Migration0001Init implements IMigration {
	private readonly envFile: string;

	private readonly client: ClickHouseClient;

	constructor(envFile: string) {
		this.envFile = envFile;
		this.client = createClient(connectorOptions(this.envFile));
	}

	public async up(): Promise<QueryResult> {
		config({ path: this.envFile });

		return await this.client.exec({
			query: `
			CREATE TABLE ${process.env.DATABASE_NAME}.${process.env.DATABASE_TABLE}
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
			`,
			clickhouse_settings: {
				wait_end_of_query: 1
			}
		});
	}

	public async down(): Promise<QueryResult> {
		config({ path: this.envFile });

		return await this.client.exec({
			query: `DROP TABLE ${process.env.DATABASE_NAME}.${process.env.DATABASE_TABLE}`,
			clickhouse_settings: {
				wait_end_of_query: 1
			}
		});
	}
}
