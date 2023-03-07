import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ClickhouseService } from './clickhouse.service';
import { ClickhouseModuleAsyncOptions } from './clickhouse-module-async-options';
import { ClickHouseClientConfigOptions } from '@clickhouse/client';

/**
 * Модуль подключения к Clickhouse
 */
@Module({})
export class ClickhouseModule {
	/**
	 * Создание асинхронного провайдера настроек подключения к БД
	 * @param options Настройки модуля для асинхронного подключения
	 * @returns Провайдер настроек
	 */
	private static createAsyncOptionsProvider(
		options: ClickhouseModuleAsyncOptions
	): Provider {
		return {
			provide: 'AsyncOptionsProvider',
			useFactory: options.useFactory,
			inject: options.inject || []
		};
	}

	/**
	 * Настройка модуля подключения к БД
	 * @param props Свойства подключения
	 * @returns Модуль подключения к БД
	 */
	static forRoot(props: ClickHouseClientConfigOptions): DynamicModule {
		const connectionFactory = {
			provide: 'ClickhouseService',
			useValue: new ClickhouseService(props)
		};

		return {
			global: true,
			module: ClickhouseModule,
			providers: [connectionFactory],
			exports: [connectionFactory]
		};
	}

	/**
	 * Асинхронная настройка модуля подключения к БД
	 * @param options Свойства подключения
	 * @returns Модуль подключения к БД
	 */
	static forRootAsync(options: ClickhouseModuleAsyncOptions): DynamicModule {
		const moduleData = {
			global: true,
			module: ClickhouseModule,
			providers: [],
			exports: []
		};

		const asyncProvider = this.createAsyncOptionsProvider(options);
		moduleData.providers.push(asyncProvider);

		const connectionFactory = {
			provide: 'ClickhouseService',
			inject: moduleData.providers[0].inject[0],
			useValue: new ClickhouseService(
				options.useFactory(new moduleData.providers[0].inject[0]())
			)
		};

		moduleData.providers.push(connectionFactory);
		moduleData.exports.push(connectionFactory);

		return moduleData;
	}
}
