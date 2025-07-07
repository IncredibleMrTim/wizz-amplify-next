import {
  PayPalButtons,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: string;
  disabled?: boolean; // Optional prop to control button state
  onSuccess: (details: any) => void; // You can type details more strictly if desired
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
          purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
          intent: "CAPTURE",
        });
      }}
      onApprove={async (data, actions) => {
        if (actions.order) {
          const details = await actions.order.capture();
          console.log(details);
          onSuccess(details);
        }
      }}
    />
  );
}
