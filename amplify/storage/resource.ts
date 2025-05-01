import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "WIZZINGTON_IMAGE_STORAGE",

  access: (allow) => ({
    "product-pictures/{entity_id}/*": [
      allow.guest.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
