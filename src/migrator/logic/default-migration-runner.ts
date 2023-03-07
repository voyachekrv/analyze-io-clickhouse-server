import { QueryResult } from '@clickhouse/client/dist/connection';
import { IMigration } from '../interface/migration.interface';
import { IRunnableMigrations } from '../interface/runnable-migrations.interface';
import { Migration0001Init } from '../migrations/0001-init';

/**
 * Аргументы команды мигратора
 */
type MigrationCommandArgument = 'up' | 'down';

/**
 * Стандартная реализация обработчика миграции
 */
export class DefaultMigrationRunner implements IRunnableMigrations {
	/**
	 * Миграция БД
	 */
	private readonly migration: IMigration;

	/**
	 * Стандартная реализация обработчика миграции
	 * @param envFile Файл переменных окружения с настройками БД
	 */
	constructor(envFile: string) {
		this.migration = new Migration0001Init(envFile);
	}

	/**
	 * Вывод потока результата запроса
	 * @param result Результат исполнения запроса
	 */
	private printStream(result: QueryResult) {
		result.stream.on('data', data => {
			console.log(data);
		});

		result.stream.on('end', () => {
			console.log('Successfully migrated');
		});
	}

	/**
	 * Запуск применения миграции
	 */
	private async up(): Promise<void> {
		const result = await this.migration.up();

		this.printStream(result);
	}

	/**
	 * Запуск отката миграции
	 */
	private async down(): Promise<void> {
		const result = await this.migration.down();

		this.printStream(result);
	}

	/**
	 * Запуск обработчика миграции
	 */
	public async run(): Promise<void> {
		const argument: MigrationCommandArgument = process
			.argv[2] as MigrationCommandArgument;

		await this[argument]();
	}
}
