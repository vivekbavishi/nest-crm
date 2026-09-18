import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Task } from '../tasks/task.entity.js';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) email!: string;
  @Column() name!: string;
  @Column() password!: string;
  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;
  @OneToMany(() => Task, (task) => task.assignedTo) tasks!: Relation<Task[]>;
}
