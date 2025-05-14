import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  userAttributes: {
    givenName: { required: true },
    familyName: { required: true },
    profilePicture: { required: false },
    phoneNumber: { required: false },
    address: { required: false },
    birthdate: { required: false },
    preferredUsername: { required: false },
  },
  loginWith: {
    email: true,
  },
});
