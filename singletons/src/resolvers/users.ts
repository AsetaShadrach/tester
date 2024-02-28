import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "project_orms/dist/entities/singeltons";
import { UserService } from "./../services/users";
import { UserInput, UserUpdateInput } from "project_orms/dist/inputs/singeltonIn";


@Resolver('Users')
export class UsersResolver{
    constructor(
        private userService: UserService,
    ){}

    @Mutation(()=>User)
    async createUser(
        @Args('userCreationInput') userCreationInput: UserInput)
        {
        return await this.userService.createUser(userCreationInput);      
    }

    @Mutation(()=>User)
    async updateUser(
        @Args('userId') userId:string,
        @Args('userUpdateInput') userUpdateInput: UserUpdateInput)
        {
        return await this.userService.updateUser(userId,userUpdateInput);      
    }    
}

