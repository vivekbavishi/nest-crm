import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Customer } from '../customers/customer.entity.js';
import { CustomersModule } from '../customers/customers.module.js';
import { User } from '../users/user.entity.js';
import { UsersModule } from '../users/users.module.js';
import { Task } from './task.entity.js';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Customer]),
    AuthModule,
    UsersModule,
    CustomersModule,
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
