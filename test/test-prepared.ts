import { INestApplication } from '@nestjs/common';
import { ClickhouseTestConfig } from '../src/db/test-config';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ConnectorModule } from '../src/connector/connector.module';
import { InsertModule } from '../src/insert/insert.module';

/**
 * Сборка тестового экземпляра приложения
 * @returns Тестовый экземпляр приложения
 */
export const testNestApplication = async (): Promise<INestApplication> => {
	const clickhouseConfigOptions = ClickhouseTestConfig;

	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			ConfigModule.forRoot({
				envFilePath: '.env.test'
			}),
			ConnectorModule.forRoot(clickhouseConfigOptions),
			InsertModule
		]
	}).compile();

	return moduleFixture.createNestApplication();
};
