import { Module } from '@nestjs/common';
import { InsertController } from './insert.controller';
import { InsertService } from './insert.service';
import { ConnectorModule } from '../connector/connector.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	controllers: [InsertController],
	providers: [InsertService],
	imports: [ConnectorModule, ConfigModule]
})
export class InsertModule {}
