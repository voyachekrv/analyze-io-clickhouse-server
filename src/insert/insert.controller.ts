import {
	Body,
	Controller,
	Param,
	Post,
	Req,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { InsertService } from './insert.service';
import { VisitInsertDto } from './visit.insert.dto';
import { Request } from 'express';

/**
 * Контроллер вставки записи в аналитическую базу данных
 */
@Controller('insert')
export class InsertController {
	constructor(private readonly insertService: InsertService) {}

	/**
	 * Вставка данных в аналитическую БД
	 * @param req HTTP-request
	 * @param shopId UUID магазина в аналитической БД
	 * @param dto DTO создания записи о посещении
	 */
	@Post('/:shopId')
	@UsePipes(new ValidationPipe())
	public async insert(
		@Req() req: Request,
		@Param('shopId') shopId: string,
		@Body() dto: VisitInsertDto
	): Promise<void> {
		await this.insertService.insert(dto, req.ip, shopId);
	}
}
