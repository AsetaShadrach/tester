import { Args, Query, Resolver } from '@nestjs/graphql';
import { GenericService } from 'src/services/generic';

@Resolver()
export class GenericResolver {
  constructor(private genericSingeltonService: GenericService) {}

  @Query(() => [String])
  async getOptionValues(@Args('optionName') optionName: string) {
    return await this.genericSingeltonService.getEnumValues(optionName);
  }
}
