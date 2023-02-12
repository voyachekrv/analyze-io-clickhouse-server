import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testNestApplication } from './test-prepared';
import { VisitInsertDto } from '../src/insert/visit.insert.dto';

/**
 * Тестирование контроллера вставки
 */
describe('InsertController (e2e)', () => {
	/**
	 * Nest-приложение
	 */
	let app: INestApplication;

	/**
	 * Тестовый UUID магазина
	 */
	const shopId = '6e9c0638-17f2-4932-a805-74578fe692a4';

	/**
	 * Данные о посещении для вставки
	 */
	const insertDto: VisitInsertDto = {
		visitorId: '91bee87d-6140-462c-a429-8b18f3241648',
		item: 'Test Item',
		price: 100.5,
		priceCurrency: 'RUB'
	};

	/**
	 * Некорректные данные о посещении для вставки
	 */
	const badInsertDto: VisitInsertDto = {
		visitorId: 'eweew',
		item: '',
		price: 100.538287239723,
		priceCurrency: ''
	};

	/**
	 * Получение экземпляра тестируемого приложения
	 */
	beforeEach(async () => {
		app = await testNestApplication();
		await app.init();
	});

	/**
	 * Тест вставки в аналитическую БД корректных данных
	 */
	it('/api/insert/{shopId} (POST) - success', () => {
		return request(app.getHttpServer())
			.post(`/insert/${shopId}`)
			.send(insertDto)
			.expect(201);
	});

	/**
	 * Тест вставки в аналитическую БД некорректных данных
	 */
	it('/api/insert/{shopId} (POST) - failed', () => {
		return request(app.getHttpServer())
			.post(`/insert/${shopId}`)
			.send(badInsertDto)
			.expect(400);
	});
});
