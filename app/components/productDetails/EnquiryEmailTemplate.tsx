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
export interface EnquiryEmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  product: Schema["Product"]["type"];
  order: Schema["Order"]["type"];
}

export const EnquiryEmailTemplate = ({
  name,
  email,
  phone,
  product,
  order,
}: EnquiryEmailTemplateProps) => {
  const temp = document.createElement("div");
  console.log(order);
  const emailHtml = (
    <div>
      <p>Hey Wizzington Moo's UK Admin</p>
      <p>
        <p>
          <i>You have a new enquiry:</i>
        </p>
        <div>
          <div>
            Name:
            <span style={{ fontWeight: "bold" }}>{name}</span>
          </div>
          <div>
            Email:
            <span style={{ fontWeight: "bold" }}> {email}</span>
          </div>
          <div>
            Phone:
            <span style={{ fontWeight: "bold" }}> {phone}</span>
          </div>
        </div>
      </p>

      <hr />

      <div>
        <p>
          <span style={{ fontWeight: "bold" }}>Product: </span> {product.name}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Base Price: </span>
          {`£${product.price}`}
        </p>
        <table
          width="600"
          style={{ width: "600px", backgroundColor: "#f5f3ff" }}
        >
          <thead style={{ backgroundColor: "#fda5d6", padding: "4px" }}>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(order).map(
              ([key, value]) =>
                key !== "productId" &&
                key !== "uid" &&
                key !== "name" && (
                  <tr
                    key={`${value}-${key}`}
                    style={{
                      borderBottom: "1px solid #d1d5dc",
                      padding: "4px",
                    }}
                  >
                    <td>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </td>
                    <td>{value !== undefined ? value.toString() : "N/A"}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  return temp.innerHTML;
};
