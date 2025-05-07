import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "WIZZINGTON_PRODUCTS",

  access: (allow) => ({
    "public/*": [allow.entity("identity").to(["read", "write", "delete"])],
  }),
});
