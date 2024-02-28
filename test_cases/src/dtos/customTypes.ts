import { createUnionType } from "@nestjs/graphql";
import { TestCaseUpdateInput } from "project_orms/dist/inputs/testCaseIn";

export const FilterTestCasesUI = createUnionType({
    name: 'FilterTestCasesUI',
    types: ()=> [null, TestCaseUpdateInput] as const,
    resolveType (reqParams) {
        if(!reqParams){
            return null;
        }
        return TestCaseUpdateInput;
    },    
})