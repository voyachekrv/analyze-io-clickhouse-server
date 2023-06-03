import { ConfigModule } from '@nestjs/config';
import { HealthcheckController } from './healthcheck.controller';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

/**
 * Модуль проверки доступности и работоспособности приложения
 */
@Module({
	imports: [ConfigModule, TerminusModule, HttpModule],
	controllers: [HealthcheckController],
	providers: []
})
export class HealthcheckModule {}
