// import { defineAuth } from "@aws-amplify/backend";

// /**
//  * Define and configure your auth resource
//  * @see https://docs.amplify.aws/gen2/build-a-backend/auth
//  */
// export const auth = defineAuth({
//   loginWith: {
//     email: true,
//   },
// });

import { referenceAuth } from "@aws-amplify/backend";

export const auth = referenceAuth({
  userPoolId: "eu-west-2_gfbLL7Ptx",
  identityPoolId: "eu-west-2:636d5105-cb13-485a-a429-f1d78b8a5c22",
  authRoleArn:
    "arn:aws:iam::385971809207:role/amplify-awsamplifygen2-ti-amplifyAuthauthenticatedU-NVLjOC77YxyN",
  unauthRoleArn:
    "arn:aws:iam::385971809207:role/amplify-awsamplifygen2-ti-amplifyAuthunauthenticate-yaOIlZZxRlPx",
  userPoolClientId: "52oocm94ic97aj0mv2hrpj6ae2",
});
