import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @Column({ default: false })
  public isConfirmed: boolean;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @ManyToOne(() => User, (user) => user.resetTokens)
  user: User;
}
