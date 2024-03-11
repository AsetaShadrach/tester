import { Field, Float, InputType, PartialType } from '@nestjs/graphql';

@InputType('TransactionInput')
export class TransactionInput {
  @Field()
  userId: string;

  @Field()
  transactionType: string;

  @Field()
  direction: string;

  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  status: string;

  @Field()
  accountFrom: string;

  @Field()
  accountTo: string;

  @Field({ nullable: true })
  externalReference: string;

  @Field({ nullable: true })
  internalReference: string;

  @Field({ nullable: true })
  finalResponseBody: string;
}

@InputType('TransactionUpdateInput')
export class TransactionUpdateInput extends PartialType(TransactionInput) {}

export default class TransactionInputs {
  TransactionInput = TransactionInput;
  TransactionUpdateInput = TransactionUpdateInput;
}
