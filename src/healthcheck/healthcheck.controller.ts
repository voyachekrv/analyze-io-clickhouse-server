/* eslint-disable array-bracket-newline */
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	HealthCheck,
	HealthCheckResult,
	HealthCheckService,
	HttpHealthIndicator
} from '@nestjs/terminus';
import * as packageJson from '../../package.json';
import { AppVersion } from '../utils/app-version.type';

/**
 * Контроллер проверки доступности и работоспособности приложения
 */
@Controller('health')
export class HealthcheckController {
	/**
	 * Контроллер проверки доступности и работоспособности приложения
	 * @param health Handles Health Checks which can be used in Controllers.
	 * @param http The HTTPHealthIndicator contains health indicators which are used for health checks related to HTTP requests
	 * @param configService Сервис конфигурации
	 */
	constructor(
		private readonly health: HealthCheckService,
		private readonly http: HttpHealthIndicator,
		private readonly configService: ConfigService
	) {}

	/**
	 * Проверка доступности приложения
	 * @returns The result of a health check
	 */
	@Get()
	@HealthCheck()
	public async check(): Promise<HealthCheckResult> {
		return await this.health.check([
			() =>
				this.http.pingCheck(
					'self',
					`http://localhost:${this.configService.get<number>(
						'PORT'
					)}/api/health/version`
				)
		]);
	}

	@Get('version')
	public getAppVersion(): AppVersion {
		return {
			version: `${packageJson['name']}@${process.env.npm_package_version}`
		};
	}
}
