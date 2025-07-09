import { OrderResponseBody } from "@/components/payPal/payPalButton/PayPalButton";
import { EmailAttachments } from "@/utils/email";
import { Schema } from "amplify/data/resource";

import ReactDOMServer from "react-dom/server";

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
        You have a new order from:
        <strong>
          {name?.given_name} {name?.surname || ""}
        </strong>
      </p>

      <h3>Message Details</h3>
      <p>
        <strong>From:</strong> {from}
      </p>
      {order.products.map((product) => {
        return (
          <div key={product.productId}>
            <img
              height="100"
              width="100"
              src={`https://amplify-awsamplifygen2-wi-wizzingtonproductimages2-eqfqxmvs6hfw.s3.eu-west-2.amazonaws.com/public/green%20two%20peice%202.jpeg`}
              alt={product.name}
            />
          </div>
        );
      })}
    </div>
  );
  temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  return temp.innerHTML;
};
