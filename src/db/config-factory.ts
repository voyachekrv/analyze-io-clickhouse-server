/* eslint-disable camelcase */

import { ConfigService } from '@nestjs/config';

export const configFactory = (configService: ConfigService) => {
	return {
		url: configService.get<string>('DATABASE_ADDRESS', 'http://localhost'),
		port: configService.get<number>('DATABASE_PORT', 8123),
		debug: false,
		basicAuth: null,
		isUseGzip: false,
		trimQuery: false,
		usePost: false,
		format: 'json',
		config: {
			session_timeout: 60,
			output_format_json_quote_64bit_integers: 0,
			enable_http_compression: 0,
			database: 'default'
		}
	};
};
