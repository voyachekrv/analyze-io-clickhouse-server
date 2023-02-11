import { exec } from 'child_process';

const promisifyProcess = () =>
	new Promise((resolve, reject) => {
		exec('npm run database:test-setup', err => {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});

const jestGlobalSetup = async () => {
	await promisifyProcess();
};

export default jestGlobalSetup;
