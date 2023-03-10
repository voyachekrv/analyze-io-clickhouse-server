import { exec, spawn } from 'child_process';

/**
 * Исполнение консольной команды запуска миграции тестовой базы данных
 * @returns Promise-объект
 */
export const promisifyProcess = (command: string) =>
	new Promise((resolve, reject) => {
		exec(command, err => {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});

/**
 * Запуск процесса с выводом на экран его логов
 * @param command Команда
 * @param args Аргрументы команды
 * @returns Полный вывод процесса в течение его работы
 */
export const promisifyProcessWithOutput = (command: string, args: string[]) => {
	try {
		return new Promise((resolve, reject) => {
			const child = spawn(command, args);

			let output = '';

			let hasErrors = false;

			child.stdout.setEncoding('utf-8');
			child.stdout.on('data', data => {
				console.log(data);
				output += data;
			});

			child.stderr.setEncoding('utf-8');
			child.stderr.on('data', data => {
				hasErrors = false;

				console.error(data);
				output += data;
			});

			child.stdout.on('close', code => {
				console.log('Process finished with code', code);

				if (hasErrors) {
					reject(output);
				} else {
					resolve(output);
				}
			});
		});
	} catch (error) {
		console.error(error);
	}
};
