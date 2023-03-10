import { Migrator } from './migrator';

/**
 * Запуск процесса миграции базы данных
 * @param envFile Файл переменных окружения
 */
export const bootstrapMigration = async (envFile: string): Promise<void> => {
	const migrator = new Migrator(envFile);

	await migrator.connect();
	await migrator.applyMigrations();
};
