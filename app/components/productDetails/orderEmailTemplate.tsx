"use client";
import { OrderResponseBody } from "@/components/payPal/payPalButton/PayPalButton";
import { Schema } from "amplify/data/resource";
import ReactDOMServer from "react-dom/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const OrderEmailTemplate = (
  props: OrderResponseBody,
  order: Schema["Order"]["type"]
) => {
  const {
    payer: { name, email_address: from },
  } = props;
  const temp = document.createElement("div");

  const totalCost = order.products.reduce(
    (total, product) => total + (product.price * product.quantity || 0),
    0
  );

  const emailHtml = (
    <div>
      <p>Hey Wizzington Moo's Boutique Admin</p>
      <p>
        <div>You have a new order:</div>
        <div>
          <div>
            Name:
            <span style={{ color: "firebrick" }}>
              {name?.given_name} {name?.surname || ""}
            </span>
          </div>
          <div>
            Email:
            <span style={{ color: "firebrick" }}> {from}</span>
          </div>
          <div>
            Order Value:
            <span style={{ color: "firebrick" }}>{`£${totalCost}`}</span>
          </div>
        </div>
      </p>

      <hr />

      {order.products.map((product) => (
        <div key={product.uid}>
          <p>{product.name}</p>
          <table width="600" style={{ width: "600px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(product).map(
                ([key, value]) =>
                  key !== "productId" &&
                  key !== "uid" &&
                  key !== "name" && (
                    <tr key={`${value}-${key}`}>
                      <td>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </td>
                      <td>{value !== undefined ? value.toString() : "N/A"}</td>
                    </tr>
                  )
              )}
              <tr>
                <td style={{ fontWeight: "bold" }}>Cost</td>
                <td style={{ fontWeight: "bold" }}>
                  {`£${(product.price * product.quantity).toFixed(2)}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
  temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  return temp.innerHTML;
};
