import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InsertModule } from './insert/insert.module';
import { ConnectorModule } from './connector/connector.module';
import { ClickhouseConfig } from './db/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true
		}),
		ConnectorModule.forRoot(ClickhouseConfig),
		InsertModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
