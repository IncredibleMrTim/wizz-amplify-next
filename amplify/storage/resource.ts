import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "wizzington_product_images2",

  access: (allow) => ({
    "public/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
      allow.guest.to(["read"]),
    ],
  }),
});
