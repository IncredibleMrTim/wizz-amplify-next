import {
  PayPalButtons,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";

export type OrderResponseBody = {
  id?: string;
  status?: string;
  payer?: {
    name?: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
    payer_id?: string;
    address?: Record<string, any>;
  };
  [key: string]: any;
};

interface PayPalButtonProps {
  amount: string;
  disabled?: boolean; // Optional prop to control button state
  onSuccess: (details: OrderResponseBody) => void; // You can type details more strictly if desired
}

export default function PayPalButton({
  amount,
  disabled,
  onSuccess,
}: PayPalButtonProps) {
  return (
    <PayPalButtons
      disabled={disabled}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { currency_code: "GBP", value: amount } }],
          intent: "CAPTURE",
        });
      }}
      onApprove={async (data, actions) => {
        if (actions.order) {
          const details = await actions.order.capture();
          onSuccess(details);
        }
      }}
    />
  );
}
