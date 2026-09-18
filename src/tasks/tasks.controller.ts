import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UserRole } from '../users/user.entity.js';
import { CreateTaskDto, TaskQueryDto, UpdateTaskDto } from './dto/task.dto.js';
import { TasksService } from './tasks.service.js';
type AuthRequest = Request & { user: { sub: number; role: UserRole } };
@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  private actor(request: AuthRequest) {
    return { id: request.user.sub, role: request.user.role };
  }
  @Get() list(@Req() request: AuthRequest, @Query() query: TaskQueryDto) {
    return this.tasks.list(this.actor(request), query);
  }
  @Post() create(@Req() request: AuthRequest, @Body() dto: CreateTaskDto) {
    return this.tasks.create(dto, this.actor(request));
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(id, dto, this.actor(request));
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
  ) {
    return this.tasks.remove(id, this.actor(request));
  }
}
