// import { UserInput, UserUpdateInput } from "project_orms/dist/inputs/singeltonIn";


// async function signupUser(params: UserInput) {
    


//     const body = {
//         query: `
//                 mutation RunTestCase {
//                     runTestCase (
//                         tCRunInput: {
//                             requestDetails: {
//                                 initiatedBy : "txn APi"
//                                 requestType : "${payload.header.method}"
//                                 url : "${payload.configs.url}"
//                                 bodyParams : [${bodyParamsList}]
//                                 headerParams : [${headerParamsList}]
//                             }
//                             ${configString}
//                         }                    
//                     ){ 
//                         ... on GenericTypeObject {
//                             httpStatus
//                             message
//                             response
//                             responseDescription
//                             referenceIds
//                             errors
//                         }
//                     }
//                 }`,
//       };
    


//     return {
//         status:200,
//         response: "ok"
//     }
    
// }