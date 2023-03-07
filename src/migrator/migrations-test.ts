import { bootstrapMigration } from './logic/bootstrap-migration';

// Запуск миграций с настройками режима тестирования
bootstrapMigration('.env.test').then();
