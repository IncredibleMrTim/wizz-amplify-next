import { OrderResponseBody } from "@/components/payPal/payPalButton/PayPalButton";

import ReactDOMServer from "react-dom/server";

export const OrderEmailTemplate = (props: OrderResponseBody) => {
  const {
    payer: { name, email_address: from },
  } = props;
  console.log(props);
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
      {/* <p>${message}</p> */}
    </div>
  );
  temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  return temp.innerHTML;
};
