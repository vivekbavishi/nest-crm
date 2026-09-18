import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity.js';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}
  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (email && password) await this.seedAdmin(email, password);
  }
  findById(id: number) { return this.users.findOne({ where: { id } }); }
  findByEmail(email: string) { return this.users.findOne({ where: { email: email.toLowerCase() } }); }
  async create(name: string, email: string, password: string) {
    if (await this.findByEmail(email)) throw new ConflictException('Email is already registered');
    return this.users.save(this.users.create({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12), role: UserRole.USER }));
  }
  list() { return this.users.find({ select: { id: true, name: true, email: true, role: true } }); }
  async updateRole(id: number, role: UserRole) {
    const user = await this.findById(id); if (!user) throw new NotFoundException('User not found');
    user.role = role; return this.users.save(user);
  }
  async seedAdmin(email: string, password: string) {
    if (await this.findByEmail(email)) return;
    await this.users.save(this.users.create({ name: 'Administrator', email: email.toLowerCase(), password: await bcrypt.hash(password, 12), role: UserRole.ADMIN }));
  }
}