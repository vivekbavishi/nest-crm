import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../task.entity.js';
export class CreateTaskDto { @IsString() @MinLength(2) title!: string; @IsString() description!: string; @IsEnum(TaskStatus) @IsOptional() status?: TaskStatus; @IsDateString() @IsOptional() dueDate?: string; @Type(() => Number) @IsInt() @IsOptional() assignedTo?: number; @Type(() => Number) @IsInt() @IsOptional() customerId?: number; }
export class UpdateTaskDto extends CreateTaskDto {}
export class TaskQueryDto { @IsEnum(TaskStatus) @IsOptional() status?: TaskStatus; @IsString() @IsOptional() title?: string; @Type(() => Number) @IsInt() @IsOptional() customerId?: number; @Type(() => Number) @IsInt() @IsOptional() assignedTo?: number; }