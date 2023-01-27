import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

let appPort: number;

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule, { cors: true });
	const configService = app.get(ConfigService);

	app.setGlobalPrefix('api');

	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', '*');
		res.header('Access-Control-Allow-Credentials', true);
		next();
	});

	appPort = configService.get('PORT');

	await app.listen(appPort);
};

bootstrap().then(() => {
	Logger.log(`Application started on port ${appPort}`, 'main');
});
