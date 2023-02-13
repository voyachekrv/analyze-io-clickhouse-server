import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConnectorService } from './connector.service';
import { ConnectorModuleAsyncOptions } from './connector-module-async-options';

/**
 * Модуль подключения к Clickhouse
 */
@Module({
	providers: [ConnectorService],
	exports: [ConnectorService]
})
export class ConnectorModule {
	/**
	 * Создание асинхронного провайдера настроек подключения к БД
	 * @param options Настройки модуля для асинхронного подключения
	 * @returns Провайдер настроек
	 */
	private static createAsyncOptionsProvider(
		options: ConnectorModuleAsyncOptions
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
	static forRoot(props: object = {}): DynamicModule {
		const connectionFactory = {
			provide: 'ConnectorService',
			useValue: new ConnectorService(props)
		};

		return {
			global: true,
			module: ConnectorModule,
			providers: [connectionFactory],
			exports: [connectionFactory]
		};
	}

	/**
	 * Асинхронная астройка модуля подключения к БД
	 * @param options Свойства подключения
	 * @returns Модуль подключения к БД
	 */
	static forRootAsync(options: ConnectorModuleAsyncOptions): DynamicModule {
		const moduleData = {
			global: true,
			module: ConnectorModule,
			providers: [],
			exports: []
		};

		const asyncProvider = this.createAsyncOptionsProvider(options);

		moduleData.providers.push(asyncProvider);

		const connectionFactory = {
			provide: 'ConnectorService',
			useValue: new ConnectorService(
				options.useFactory(new moduleData.providers[0].inject[0]())
			)
		};

		moduleData.providers.push(connectionFactory);
		moduleData.exports.push(connectionFactory);

		return moduleData;
	}
}
