import { exec } from 'child_process';

/**
 * Исполнение консольной команды запуска отката миграции тестовой базы данных
 * @returns Promise-объект
 */
const promisifyProcess = () =>
	new Promise((resolve, reject) => {
		exec('npm run database:test-teardown', err => {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});

/**
 * Настройки, производящиеся после окончания процесса тестирования
 */
const jestGlobalTeardown = async () => {
	await promisifyProcess();
};

export default jestGlobalTeardown;
