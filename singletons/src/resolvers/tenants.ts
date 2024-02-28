import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Tenant } from "project_orms/dist/entities/singeltons";
import { TenantService } from "./../services/tenants";
import { TenantInput, TenantUpdateInput } from "project_orms/dist/inputs/singeltonIn";


@Resolver('Tenants')
export class TenantsResolver{
    constructor(
        private tenantService: TenantService,
    ){}

    @Mutation(()=>Tenant)
    async createTenant(
        @Args('tenantCreationInput') tenantCreationInput: TenantInput)
        {
        return await this.tenantService.createTenant(tenantCreationInput);      
    }

    @Mutation(()=>Tenant)
    async updateTenant(
        @Args('tenantId') tenantId:string,
        @Args('tenantUpdateInput') tenantUpdateInput: TenantUpdateInput)
        {
        return await this.tenantService.updateTenant(tenantId,tenantUpdateInput);      
    }    
}

