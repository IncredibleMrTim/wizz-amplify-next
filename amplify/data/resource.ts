import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Images: a.customType({
    url: a.string().required(),
    altText: a.string(),
    caption: a.string(),
    order: a.integer().required(),
  }),

  Product: a
    .model({
      id: a.string().required(),
      name: a.string().required(),
      description: a.string().required(),
      price: a.integer().required(),
      category: a.string(),
      isFeatured: a.boolean().default(false),
      stock: a.integer().required(),
      order: a.integer().default(0),
      images: a.ref("Images").array(), // Reference to Images
    })

    .authorization((allow) => [allow.publicApiKey()]),

  pageSettings: a
    .model({
      strapLine: a.string(),
      copyright: a.string(),
      logo: a.string(),
      headerImage: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
