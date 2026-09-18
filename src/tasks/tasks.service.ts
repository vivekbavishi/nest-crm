import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Customer } from '../customers/customer.entity.js';
import { User, UserRole } from '../users/user.entity.js';
import { CreateTaskDto, TaskQueryDto, UpdateTaskDto } from './dto/task.dto.js';
import { Task } from './task.entity.js';
@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly tasks: Repository<Task>, @InjectRepository(User) private readonly users: Repository<User>, @InjectRepository(Customer) private readonly customers: Repository<Customer>) {}
  async list(actor: { id: number; role: UserRole }, query: TaskQueryDto) {
    const where: Record<string, unknown> = {};
    if (actor.role !== UserRole.ADMIN) where.assignedTo = { id: actor.id };
    else if (query.assignedTo) where.assignedTo = { id: query.assignedTo };
    if (query.status) where.status = query.status;
    if (query.customerId) where.customer = { id: query.customerId };
    if (query.title) where.title = Like(`%${query.title}%`);
    return this.tasks.find({ where, order: { dueDate: 'ASC', id: 'DESC' } });
  }
  private async get(id: number) { const task = await this.tasks.findOne({ where: { id } }); if (!task) throw new NotFoundException('Task not found'); return task; }
  private canManage(task: Task, actor: { id: number; role: UserRole }) { if (actor.role !== UserRole.ADMIN && task.assignedTo?.id !== actor.id) throw new ForbiddenException('You can only manage your assigned tasks'); }
  async create(dto: CreateTaskDto, actor: { id: number; role: UserRole }) { const assignedTo = await this.users.findOneBy({ id: actor.role === UserRole.ADMIN && dto.assignedTo ? dto.assignedTo : actor.id }); if (!assignedTo) throw new NotFoundException('Assigned user not found'); const customer = dto.customerId ? await this.customers.findOneBy({ id: dto.customerId }) : null; if (dto.customerId && !customer) throw new NotFoundException('Customer not found'); return this.tasks.save(this.tasks.create({ title: dto.title, description: dto.description, status: dto.status, dueDate: dto.dueDate ? new Date(dto.dueDate) : null, assignedTo, customer })); }
  async update(id: number, dto: UpdateTaskDto, actor: { id: number; role: UserRole }) { const task = await this.get(id); this.canManage(task, actor); Object.assign(task, { title: dto.title ?? task.title, description: dto.description ?? task.description, status: dto.status ?? task.status, dueDate: dto.dueDate ? new Date(dto.dueDate) : task.dueDate }); if (dto.assignedTo && actor.role === UserRole.ADMIN) task.assignedTo = await this.users.findOneByOrFail({ id: dto.assignedTo }); if (dto.customerId !== undefined) task.customer = dto.customerId ? await this.customers.findOneByOrFail({ id: dto.customerId }) : null; return this.tasks.save(task); }
  async remove(id: number, actor: { id: number; role: UserRole }) { const task = await this.get(id); this.canManage(task, actor); await this.tasks.remove(task); return { message: 'Task deleted' }; }
}