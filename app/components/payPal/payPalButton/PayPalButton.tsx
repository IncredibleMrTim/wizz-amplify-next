import {
  PayPalButtons,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: string;
  onSuccess: (details: any) => void; // You can type details more strictly if desired
}

export default function PayPalButton({ amount, onSuccess }: PayPalButtonProps) {
  return (
    <PayPalButtons
      createOrder={(
        data: PayPalButtonsComponentProps["createOrder"]["data"],
        actions: PayPalButtonsComponentProps["createOrder"]["actions"]
      ) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: amount } }],
        });
      }}
      onApprove={async (
        data: PayPalButtonsComponentProps["onApprove"]["data"],
        actions: PayPalButtonsComponentProps["onApprove"]["actions"]
      ) => {
        if (actions.order) {
          const details = await actions.order.capture();
          console.log(details);
          onSuccess(details);
        }
      }}
    />
  );
}
