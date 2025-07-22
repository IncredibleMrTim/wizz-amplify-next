import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
// import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

// const stack = backend.auth.resources.cfnResources.cfnUserPool.stack;

// // Reference your existing User Pool
// const existingUserPool = UserPool.fromUserPoolId(
//   stack,
//   "ExistingUserPool",
//   "eu-west-2_6sEMhwInO" // Replace with your actual User Pool ID
// );

// // Reference your existing User Pool Client (App Client)
// const existingUserPoolClient = UserPoolClient.fromUserPoolClientId(
//   stack,
//   "ExistingUserPoolClient",
//   "4jad127dubscuktld0qpv825k" // Replace with your actual App Client ID
// );

// // Override the default User Pool with your existing one
// backend.auth.resources.userPool = existingUserPool;
// backend.auth.resources.userPoolClient = existingUserPoolClient;
