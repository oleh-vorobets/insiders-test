import { IsEmail, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
@Index('idx_user_email', ['email'])
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'email', unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({ type: 'varchar', name: 'first_name' })
  @Length(1, 40)
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  @Length(1, 40)
  lastName: string;

  @Column({ type: 'varchar', name: 'token', nullable: true })
  token: string;

  @Column({ type: 'boolean', name: 'remember_password', default: true })
  rememberPassword: boolean;

  @Column({ type: 'boolean', name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
