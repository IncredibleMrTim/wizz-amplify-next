import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "WIZZINGTON_IMAGE_STORAGE",

  access: (allow) => ({
    "public/*": [allow.entity("identity").to(["read", "write", "delete"])],
  }),
});
