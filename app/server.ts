"use client";
import "dotenv/config";

import bodyParser from "body-parser";
import express from "express";

import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";

const app = express();
app.use(bodyParser.json());

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8080 } = process.env;

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID || "",
    oAuthClientSecret: PAYPAL_CLIENT_SECRET || "",
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);
const paymentsController = new PaymentsController(client);

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart: any) => {
  const collect = {
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: "100",
            breakdown: {
              itemTotal: {
                currencyCode: "USD",
                value: "100",
              },
            },
          },
          // lookup item details in `cart` from database
          items: [
            {
              name: "T-Shirt",
              unitAmount: {
                currencyCode: "USD",
                value: "100",
              },
              quantity: "1",
              description: "Super Fresh Shirt",
              sku: "sku01",
            },
          ],
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body.toString()),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      if (typeof error === "object" && error !== null && "message" in error) {
        throw new Error((error as { message: string }).message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  }
};

// createOrder route
app.post("/api/orders", async (req: express.Request, res: express.Response) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const result = await createOrder(cart);
    if (!result) {
      throw new Error("Failed to create order.");
    }
    const { jsonResponse, httpStatusCode } = result;
    res.status(httpStatusCode).json(jsonResponse);

    return jsonResponse.orderID;
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID: any) => {
  const collect = {
    id: orderID,
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.captureOrder(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body.toString()),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      if (typeof error === "object" && error !== null && "message" in error) {
        throw new Error((error as { message: string }).message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  }
};

// captureOrder route
app.post(
  "/api/orders/:orderID/capture",
  async (req: express.Request, res: express.Response) => {
    try {
      const { orderID } = req.params;
      const result = await captureOrder(orderID);
      if (!result) {
        throw new Error("Failed to capture order.");
      }
      const { jsonResponse, httpStatusCode } = result;
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});
