/**
 * Обработка применения / отката миграции
 */
export interface IRunnableMigrations {
	/**
	 * Запуск процесса работы мигратора
	 */
	run(): Promise<void>;
}
