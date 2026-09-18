import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Customer } from '../customers/customer.entity.js';
import { User } from '../users/user.entity.js';
export enum TaskStatus { TODO = 'todo', IN_PROGRESS = 'in-progress', DONE = 'done' }
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn() id!: number;
  @Column() title!: string;
  @Column({ type: 'text', default: '' }) description!: string;
  @Column({ type: 'simple-enum', enum: TaskStatus, default: TaskStatus.TODO }) status!: TaskStatus;
  @Column({ type: 'datetime', nullable: true }) dueDate!: Date | null;
  @ManyToOne(() => User, (user) => user.tasks, { eager: true, onDelete: 'CASCADE' }) @JoinColumn({ name: 'assignedToId' }) assignedTo!: Relation<User>;
  @ManyToOne(() => Customer, (customer) => customer.tasks, { eager: true, nullable: true, onDelete: 'SET NULL' }) @JoinColumn({ name: 'customerId' }) customer!: Relation<Customer> | null;
}