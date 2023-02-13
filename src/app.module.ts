import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InsertModule } from './insert/insert.module';
import { ConnectorModule } from './connector/connector.module';
import { configFactory } from './db/config-factory';

/**
 * Основной модуль приложения
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true
		}),
		ConnectorModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: configFactory
		}),
		InsertModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
