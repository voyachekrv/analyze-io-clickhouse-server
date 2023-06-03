import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testNestApplication } from './test-prepared';

/**
 * Тестирование контроллера HealthCheck
 */
describe('HealthCheckController (e2e)', () => {
	/**
	 * Nest-приложение
	 */
	let app: INestApplication;

	/**
	 * Получение экземпляра тестируемого приложения
	 */
	beforeEach(async () => {
		app = await testNestApplication();
		await app.init();
	});

	/**
	 * Тест получение версии приложения
	 */
	it('/api/health/version (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/health/version')
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body).toBeDefined();
			});
	});
});
