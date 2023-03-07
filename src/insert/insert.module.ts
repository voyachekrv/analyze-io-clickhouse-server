import { Module } from '@nestjs/common';
import { InsertController } from './insert.controller';
import { InsertService } from './insert.service';
import { ConfigModule } from '@nestjs/config';
import { ClickhouseModule } from '../nestjs-clickhouse/clickhouse.module';

/**
 * Модуль вставки в базу данных
 */
@Module({
	controllers: [InsertController],
	providers: [InsertService],
	imports: [ConfigModule, ClickhouseModule]
})
export class InsertModule {}
