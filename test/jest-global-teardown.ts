import { exec } from 'child_process';

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

const jestGlobalTeardown = async () => {
	await promisifyProcess();
};

export default jestGlobalTeardown;
