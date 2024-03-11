import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '../enums/transactionE';

@Entity('Transaction')
@ObjectType('TransactionObject')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', name: 'user_id' })
  @Field()
  userId: string;

  @Column({
    type: 'enum',
    name: 'transaction_type',
    enum: TransactionType,
  })
  @Field()
  transactionType: string;

  @Column({
    type: 'enum',
    name: 'transaction_direction',
    enum: TransactionDirection,
  })
  @Field()
  direction: string;

  @Column({ type: 'decimal', name: 'amount' })
  @Field(() => Float)
  amount: number;

  @Column({
    type: 'enum',
    name: 'status',
    enum: TransactionStatus,
    default: TransactionStatus.INITIATED,
  })
  @Field()
  status: string;

  @Column({ type: 'varchar', name: 'account_from' })
  @Field()
  accountFrom: string;

  @Column({ type: 'varchar', name: 'account_to' })
  @Field()
  accountTo: string;

  @Column({ type: 'varchar', name: 'external_reference', nullable: true })
  @Field()
  externalReference: string;

  @Column({ type: 'varchar', name: 'internal_reference', nullable: true })
  @Field()
  internalReference: string;

  @Column({ type: 'jsonb', name: 'final_response_body', nullable: true })
  @Field({ nullable: true })
  finalResponseBody: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @Field()
  updatedAt: Date;
}

export default class TransactionEntities {
  Transaction = Transaction;
}
