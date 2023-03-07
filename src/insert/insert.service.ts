import {
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger
} from '@nestjs/common';
import { VisitInsertDto } from './visit.insert.dto';
import { ConfigService } from '@nestjs/config';
import { ClickhouseService } from '../nestjs-clickhouse/clickhouse.service';
import * as uuid4 from 'uuid4';
import { DateTime } from 'luxon';
import { InsertResultDto } from '../utils/insert.result.dto';

/**
 * Сервис вставки записи в аналитическую базу данных
 */
@Injectable()
export class InsertService {
	/**
	 * Сервис вставки записи в аналитическую базу данных
	 * @param clickhouseService Сервис подключений к Clickhouse
	 * @param configService Сервис конфигурации
	 */
	constructor(
		private readonly configService: ConfigService,
		@Inject('ClickhouseService')
		private readonly clickhouseService: ClickhouseService
	) {}

	/**
	 * Вставка записи в аналитическую базу данных
	 * @param dto DTO создания записи о посещении
	 * @param clientIp IP клиента
	 * @param shopId UUID магазина в аналитической БД
	 * @returns ID запроса
	 */
	public async insert(
		dto: VisitInsertDto,
		ip: string,
		shopId: string
	): Promise<InsertResultDto> {
		Logger.log(
			`inserting visit, visitorId: ${dto.visitorId}, item: ${dto.item}; price: ${dto.price}, priceCurrency: ${dto.priceCurrency}`,
			this.constructor.name
		);

		try {
			const result = await this.clickhouseService.insert({
				table: this.configService.get<string>(
					'DATABASE_TABLE',
					'default'
				),
				values: [
					{
						id: uuid4(),
						createdAt: DateTime.now().toFormat(
							'yyyy-MM-dd HH:mm:ss'
						),
						shopId,
						ip,
						...dto
					}
				],
				format: 'JSONEachRow'
			});

			Logger.log(
				`Successful inserted, query id: ${result.query_id}`,
				this.constructor.name
			);

			return { queryId: result.query_id };
		} catch (e) {
			Logger.error(e, this.constructor.name);
			throw new InternalServerErrorException(e.message);
		}
	}
}
