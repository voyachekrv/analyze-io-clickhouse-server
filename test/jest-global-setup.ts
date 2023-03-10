import { promisifyProcess } from '../src/utils/promisify-process';

/**
 * Настройки, производящиеся перед началом процесса тестирования
 */
const jestGlobalSetup = async () => {
	await promisifyProcess('npm run database:test-setup');
};

export default jestGlobalSetup;
