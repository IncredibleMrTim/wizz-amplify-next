import { defineFunction } from "@aws-amplify/backend";

export const thumbnailGenerator = defineFunction({
  name: "thumbnailGenerator",
  entry: "./src/index.ts",
});
