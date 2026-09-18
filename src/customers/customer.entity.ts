import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity.js';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column({ unique: true }) email!: string;
  @Column() company!: string;
  @Column() contact!: string;
  @OneToMany(() => Task, (task) => task.customer) tasks!: Task[];
}