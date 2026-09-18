import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { UsersModule } from './users/users.module.js';
import { User } from './users/user.entity.js';
import { Customer } from './customers/customer.entity.js';
import { Task } from './tasks/task.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL is required');
        }
        const synchronize =
          config.get<string>('DATABASE_SYNCHRONIZE', 'true') === 'true';

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [User, Customer, Task],
          synchronize,
          ssl: databaseUrl.includes('sslmode=require')
            ? { rejectUnauthorized: false }
            : false,
        };
      },
    }),
    UsersModule,
    AuthModule,
    CustomersModule,
    TasksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
