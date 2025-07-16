import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  SizeMetric: a.customType({
    metric: a.string(),
  }),

  // Lookup table for Order and Product
  OrderProduct: a.customType({
    uid: a.id().required(),
    productId: a.string().required(),
    name: a.string().required(),
    quantity: a.integer().required(),
    waistSize: a.integer(),
    chestSize: a.integer(),
    hipSize: a.integer(),
    girth: a.integer(),
    headSize: a.integer(),
    neckSize: a.integer(),
    bicepSize: a.integer(),
    armpitToWrist: a.integer(),
    wristSize: a.integer(),
    inseam: a.integer(),
    waistToAnkle: a.integer(),
    waistToFloor: a.integer(),
    ankleSize: a.integer(),
    height: a.integer(),
    notes: a.string(),
    metric: a.ref("SizeMetric"), // Reference to SizeMetrics
    price: a.integer().required(),
  }),

  Images: a.customType({
    url: a.string().required(),
    altText: a.string(),
    caption: a.string(),
    order: a.integer().required(),
  }),

  Customer: a
    .model({
      id: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.email().required(),
      phone: a.string(),
      address: a.string(),
      city: a.string(),
      postalCode: a.string(),
      country: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

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

  Order: a
    .model({
      id: a.string().required(),
      products: a.ref("OrderProduct").array().required(), // Reference to Product:
      customerId: a.string(), // Reference to Customer
      totalAmount: a.integer(),
      status: a.string().default("Pending"), // e.g., Pending, Completed, Cancelled
      deliveryDate: a.date(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  OrderBasket: a
    .model({
      id: a.string().required(),
      products: a.ref("OrderProduct").array().required(), // Reference to Product:
      customerId: a.string(), // Reference to Customer
      totalAmount: a.integer(),
      status: a.string().default("Pending"), // e.g., Pending, Completed, Cancelled
      deliveryDate: a.date(),
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
