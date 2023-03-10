/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModuleMetadata } from '@nestjs/common';
import { ClickhouseConfigType } from './clickhouse-config.type';

/**
 * Настройки для асинхронного подключения модуля базы данных
 */
export interface ClickhouseModuleAsyncOptions
	extends Pick<ModuleMetadata, 'imports'> {
	/**
	 * Внедряемые провайдеры
	 */
	inject?: any[];

	/**
	 * Используемый фабричный метод для получения настроек подключения к БД
	 * @param args Внедренные провайдеры
	 * @returns Настройки подключения к БД
	 */
	useFactory?: (...args: any[]) => ClickhouseConfigType;
}
