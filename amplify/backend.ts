import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { storage } from "./storage/resource.js";

const backend = defineBackend({
  auth,
  data,
  storage,
});

const { cfnBucket: defaultBucket } = backend.storage.resources.cfnResources;
defaultBucket.bucketName = "wizzington-product-images";
