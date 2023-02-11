import { DynamicModule, Module } from '@nestjs/common';
import { ConnectorService } from './connector.service';

@Module({
	providers: [ConnectorService],
	exports: [ConnectorService]
})
export class ConnectorModule {
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
}
