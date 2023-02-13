import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConnectorModule } from '../src/connector/connector.module';
import { InsertModule } from '../src/insert/insert.module';
import { configFactory } from '../src/db/config-factory';

/**
 * Сборка тестового экземпляра приложения
 * @returns Тестовый экземпляр приложения
 */
export const testNestApplication = async (): Promise<INestApplication> => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			ConfigModule.forRoot({
				envFilePath: '.env.test',
				isGlobal: true
			}),
			ConnectorModule.forRootAsync({
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: configFactory
			}),
			InsertModule
		]
	}).compile();

	return moduleFixture.createNestApplication();
};
