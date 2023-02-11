import {
	Injectable,
	InternalServerErrorException,
	Logger
} from '@nestjs/common';
import { ConnectorService } from '../connector/connector.service';
import { VisitInsertDto } from './visit.insert.dto';
import { ConfigService } from '@nestjs/config';

/**
 * Сервис вставки записи в аналитическую базу данных
 */
@Injectable()
export class InsertService {
	/**
	 * Сервис вставки записи в аналитическую базу данных
	 * @param connectorService Сервис подключений к Clickhouse
	 * @param configService Сервис конфигурации
	 */
	constructor(
		private readonly connectorService: ConnectorService,
		private readonly configService: ConfigService
	) {}

	/**
	 * Вставка записи в аналитическую базу данных
	 * @param dto DTO создания записи о посещении
	 * @param clientIp IP клиента
	 * @param shopId UUID магазина в аналитической БД
	 */
	public async insert(
		dto: VisitInsertDto,
		clientIp: string,
		shopId: string
	): Promise<void> {
		Logger.log(
			`inserting visit, visitorId: ${dto.visitorId}, item: ${dto.item}; price: ${dto.price}, priceCurrency: ${dto.priceCurrency}`,
			this.constructor.name
		);

		const sql = `INSERT INTO default.${this.configService.get<string>(
			'DATABASE_NAME'
		)} (id, createdAt, shopId, ip, visitorId, item, price, priceCurrency) VALUES (generateUUIDv4(), now(), '${shopId}', '${clientIp}', '${
			dto.visitorId
		}', '${dto.item}', ${dto.price}, '${dto.priceCurrency}');`;

		Logger.log(`query: ${sql}`, this.constructor.name);

		try {
			// eslint-disable-next-line newline-per-chained-call
			await this.connectorService.getConnection().query(sql).toPromise();
		} catch (e) {
			throw new InternalServerErrorException(e.message);
		}
	}
}
