/* eslint-disable camelcase */
import {
	ClickHouseClient,
	ClickHouseError,
	createClient
} from '@clickhouse/client';
import { config } from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as uuid4 from 'uuid4';

/**
 * Структура записи о приготовленной для запуска миграции
 */
type PreparedMigration = {
	name: string;
	code: string;
	order: number;
};

/**
 * Мигратор базы данных
 */
export class Migrator {
	/**
	 * Файл переменных окружения для конфигурации подключения к БД
	 */
	private readonly envFile: string;

	/**
	 * Клиент Clickhouse
	 */
	private client: ClickHouseClient;

	/**
	 * Мигратор базы данных
	 * @param envFile Файл переменных окружения для конфигурации подключения к БД
	 */
	constructor(envFile: string) {
		this.envFile = envFile;
	}

	/**
	 * Проверка запроса к Clickhouse
	 * @returns Удалось ли выполнить запрос
	 */
	private async healthCheck(): Promise<boolean> {
		const versionQuery = await this.client.query({
			query: 'select version();',
			clickhouse_settings: {
				wait_end_of_query: 1
			}
		});

		const version = await versionQuery.json();

		if (version['data']) {
			return true;
		}

		return false;
	}

	/**
	 * Перезапуск подключения
	 */
	private async restartConnection(): Promise<void> {
		await setTimeout(async () => {
			await this.client.close();
			await this.connect();
		}, 3000);
	}

	/**
	 * Проверка на существование таблицы миграций
	 * @returns Существует ли таблица миграций
	 */
	private async checkMigrationsTableExists(): Promise<boolean> {
		config({ path: this.envFile });

		try {
			const query = await this.client.query({
				query: `check table ${process.env.DATABASE_NAME}.migrations`,
				query_params: {
					format: 'JSONEachRow'
				}
			});

			const result = await query.json();

			if (result['data'][0].result === 1) {
				return true;
			}
			return false;
		} catch (e) {
			if ((e as ClickHouseError).type === 'UNKNOWN_TABLE') {
				return false;
			}
			throw new Error(e);
		}
	}

	/**
	 * Создание таблицы миграций
	 */
	private async createMigrationsTable(): Promise<void> {
		config({ path: this.envFile });

		try {
			await this.client.exec({
				query: `CREATE TABLE ${process.env.DATABASE_NAME}.migrations (
					id String, 
					name String, 
					order UInt16
				)
				ENGINE = MergeTree
				PRIMARY KEY id
				ORDER BY id
				SETTINGS index_granularity = 8192;`,
				clickhouse_settings: {
					wait_end_of_query: 1
				}
			});
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Получить количество примененных миграций на основании таблицы миграций
	 * @returns Количество примененных миграций
	 */
	private async getAppliedMigrationsCount(): Promise<number> {
		config({ path: this.envFile });

		try {
			const query = await this.client.query({
				query: `select count(*) as "count" from ${process.env.DATABASE_NAME}.migrations;`,
				format: 'JSONEachRow'
			});

			const queryJson = await query.json();

			return queryJson[0].count;
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Получить максимальный на момент получения порядковый номер миграции
	 * @returns Максимальный на момент получения порядковый номер миграции
	 */
	private async getMaxOrder(): Promise<number> {
		config({ path: this.envFile });

		try {
			const query = await this.client.query({
				query: `select max(order) as "maxOrder" from ${process.env.DATABASE_NAME}.migrations;`,
				format: 'JSONEachRow'
			});

			const queryJson = await query.json();

			return queryJson[0].maxOrder;
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Прочитать SQL-файлы и подготовить SQL-код к исполнению
	 * @returns Подготовленные миграции к применению
	 */
	private async prepareSQLCode(): Promise<PreparedMigration[]> {
		config({ path: this.envFile });

		const pathToMigrations = path.resolve(
			process.cwd(),
			'src',
			'migrator',
			process.env.DATABASE_NAME
		);

		const result: PreparedMigration[] = [];

		const appliedMigrationsCount = await this.getAppliedMigrationsCount();

		const sqlFiles = await fs.readdir(pathToMigrations);

		if (sqlFiles.length > appliedMigrationsCount) {
			const notAppliedMigrations = sqlFiles.slice(
				appliedMigrationsCount - 1,
				sqlFiles.length
			);

			let currentOrder = await this.getMaxOrder();

			for (let i = 0; i < notAppliedMigrations.length; i++) {
				const code = await fs.readFile(
					path.resolve(pathToMigrations, notAppliedMigrations[i])
				);

				currentOrder++;

				result.push({
					name: notAppliedMigrations[i],
					code: code.toString().trim(),
					order: currentOrder
				});
			}
		}

		return result;
	}

	/**
	 * Применить заданные миграции
	 * @param codes Список подготовленных к применению миграций
	 */
	private async runSqlCodes(codes: PreparedMigration[]): Promise<void> {
		try {
			for (const code of codes) {
				const queryResult = await this.client.exec({
					query: code.code,
					clickhouse_settings: {
						wait_end_of_query: 1
					}
				});

				if (queryResult.query_id) {
					console.log('Success', queryResult.query_id);

					const insertResult = await this.client.insert({
						table: 'default.migrations',
						values: [
							{
								id: uuid4(),
								name: code.name,
								order: code.order
							}
						],
						format: 'JSONEachRow'
					});

					if (insertResult.query_id) {
						console.log(
							'Table default.migrations updated: ',
							insertResult.query_id
						);
					}
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Подключение к базе данных
	 */
	public async connect(): Promise<void> {
		config({ path: this.envFile });

		this.client = createClient({
			host: `http://${process.env.DATABASE_ADDRESS || 'localhost'}:${
				process.env.DATABASE_PORT || 8123
			}`,
			database: process.env.DATABASE_NAME || 'default'
		});

		try {
			if (await this.client.ping()) {
				if (await this.healthCheck()) {
					return null;
				}
				await this.restartConnection();
			}
		} catch (e) {
			await this.restartConnection();
		}
	}

	/**
	 * Проверка на наличие свежих миграций и применение их,
	 * если они ранее не были применены
	 */
	public async applyMigrations(): Promise<void> {
		if (!(await this.checkMigrationsTableExists())) {
			await this.createMigrationsTable();
		}

		const notAppliedMigrations = await this.prepareSQLCode();

		if (notAppliedMigrations.length > 0) {
			await this.runSqlCodes(notAppliedMigrations);
		} else {
			console.log('All migrations are applied');
		}
	}
}
