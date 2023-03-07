import { IRunnableMigrations } from '../interface/runnable-migrations.interface';
import { DefaultMigrationRunner } from './default-migration-runner';

/**
 * Входная точка обработчика миграции
 * @param envFile Файл переменных окружения с параметрами подключения к БД
 */
export const bootstrapMigration = async (envFile: string): Promise<void> => {
	const runner: IRunnableMigrations = new DefaultMigrationRunner(envFile);
	await runner.run();
};
