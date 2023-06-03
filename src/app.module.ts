import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InsertModule } from './insert/insert.module';
import { ClickhouseModule } from './nestjs-clickhouse/clickhouse.module';
import { clickhouseClientFactory } from './clickhouse-client-factory';

/**
 * Основной модуль приложения
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true
		}),
		ClickhouseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: clickhouseClientFactory
		}),
		InsertModule,
		HealthcheckModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
