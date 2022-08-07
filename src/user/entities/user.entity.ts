import { ResetToken } from 'src/auth/entities/reset-token';
import { Preference } from 'src/preference/entities/preference.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  full_name: string;

  @Column({ nullable: true, type: 'date' })
  dob: Date;

  @Column({ default: false })
  public isConfirmed: boolean;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => ResetToken, (resetToken) => resetToken.user)
  resetTokens: ResetToken[];

  @ManyToMany(() => Preference)
  @JoinTable()
  preferences: Preference[];
}
