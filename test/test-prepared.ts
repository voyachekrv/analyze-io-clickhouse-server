import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { clickhouseClientFactory } from '../src/clickhouse-client-factory';
import { InsertModule } from '../src/insert/insert.module';
import { ClickhouseModule } from '../src/nestjs-clickhouse/clickhouse.module';
import { HealthcheckModule } from '../src/healthcheck/healthcheck.module';

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
			ClickhouseModule.forRootAsync({
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: clickhouseClientFactory
			}),
			InsertModule,
			HealthcheckModule
		]
	}).compile();

	return moduleFixture.createNestApplication();
};
