import {
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
	IsUUID,
	MaxLength
} from 'class-validator';
import { InsertStrings } from './insert.strings';

/**
 * Запись о посещении
 */
export class VisitInsertDto {
	/**
	 * ID пользователя в аналитической БД
	 */
	@IsString({ message: InsertStrings.SHOULD_BE_STRING })
	@IsNotEmpty({ message: InsertStrings.SHOULD_BE_NOT_EMPTY })
	@IsUUID('4', { message: InsertStrings.SHOULD_BE_UUIDV4 })
	visitorId: string;

	/**
	 * Название товара на странице
	 */
	@IsString({ message: InsertStrings.SHOULD_BE_STRING })
	@IsNotEmpty({ message: InsertStrings.SHOULD_BE_NOT_EMPTY })
	item: string;

	/**
	 * Цена товара
	 */
	@IsNumber(
		{ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4 },
		{ message: InsertStrings.SHOULD_BE_NUMBER }
	)
	@IsPositive({ message: InsertStrings.SHOULD_BE_POSITIVE })
	@IsNotEmpty({ message: InsertStrings.SHOULD_BE_NOT_EMPTY })
	price: number;

	/**
	 * Валюта, в которой представлена на странице цена
	 */
	@IsString({ message: InsertStrings.SHOULD_BE_STRING })
	@IsNotEmpty({ message: InsertStrings.SHOULD_BE_NOT_EMPTY })
	@MaxLength(16)
	priceCurrency: string;
}
