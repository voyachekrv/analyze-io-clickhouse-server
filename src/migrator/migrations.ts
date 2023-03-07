import { bootstrapMigration } from './logic/bootstrap-migration';

// Запуск миграций с настройками основного режима работы
bootstrapMigration('.env').then();
