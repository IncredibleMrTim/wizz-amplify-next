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

  const emailHtml = (
    <div>
      <p>Hey Wizzington Moo's Boutique Admin</p>
      <p>
        <div>You have a new order:</div>
        <div>
          <p>
            Name:
            <span style={{ color: "firebrick" }}>
              {name?.given_name} {name?.surname || ""}
            </span>
          </p>
          <p>
            Email:
            <span style={{ color: "firebrick" }}> {from}</span>
          </p>
          <p>
            <span style={{ color: "firebrick" }}>
              Order Value: {order.totalAmount}
            </span>
          </p>
        </div>
      </p>

      <hr />

      {order.products.map((product) => (
        <div key={product.uid}>
          <p>{product.name}</p>
          <Table
            style={{
              marginLeft: "10px",
              border: "1px solid #ccc",
              width: "300px",
            }}
          >
            <TableCaption
              style={{
                textAlign: "left",
              }}
            >
              Specifications
            </TableCaption>
            <TableHeader style={{ backgroundColor: "firebrick" }}>
              <TableRow>
                <TableHead
                  style={{
                    textAlign: "left",
                    fontWeight: "normal",
                    color: "#fff",
                  }}
                >
                  Name
                </TableHead>
                <TableHead
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    fontWeight: "normal",
                    color: "#fff",
                  }}
                >
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(product).map(
                ([key, value]) =>
                  key !== "productId" &&
                  key !== "uid" &&
                  key !== "name" && (
                    <TableRow
                      key={`${product.uid}-${key}`}
                      style={{
                        backgroundColor: "#f9f9f9",
                        padding: "4px",
                      }}
                    >
                      <TableCell>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </TableCell>
                      <TableCell>
                        {value !== undefined ? value.toString() : "N/A"}
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
  temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  return temp.innerHTML;
};
