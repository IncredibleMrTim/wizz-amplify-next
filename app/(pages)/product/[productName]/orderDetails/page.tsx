"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { useAppSelector } from "@/stores/store";
import { FormField as FField } from "./FormField";
import { FiCalendar } from "react-icons/fi";
import { PiBasket } from "react-icons/pi";
import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider";
import PayPalButton from "@/components/payPal/payPalButton/PayPalButton";
import { sendEmail } from "@/utils/email"; // Adjust the import path as necessary
import { Calendar } from "@/components/ui/calendar";

type VariantType = "number" | "textarea" | "text" | "date" | "hidden";

const formFields: {
  [key: string]: {
    label: string;
    placeholderText: string;
    variant: VariantType;
    icon?: any;
    classes?: { formItem: string };
    span?: boolean;
  };
}[] = [
  {
    chestSize: {
      label: "Chest Size (Circumference Around Chest)",
      placeholderText: "Enter chest size",
      // // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    waistSize: {
      label: "Waist Size (Circumference Around Waist)",
      placeholderText: "Enter waist size",
      // // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    hipsSize: {
      label: "Hip Size (Circumference Around Hips)",
      placeholderText: "Enter hip size",
      // // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    girth: {
      label: "Girth Measurement (Around the Body)",
      placeholderText: "Girth measurement",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    headSize: {
      label: "Head Size (Hat Size)",
      placeholderText: "Enter head size",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    neckSize: {
      label: "Neck Size (Collar Size)",
      placeholderText: "Enter neck size",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    bicepSize: {
      label: "Bicep Size (Upper Arm Circumference)",
      placeholderText: "Enter bicep size",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    armpitToWrist: {
      label: "Armpit to Wrist (Arm Length)",
      placeholderText: "Enter armpit to wrist",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    wristSize: {
      label: "Wrist Size",
      placeholderText: "Enter wrist size",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    inseam: {
      label: "Inseam (Crotch to Ankle Length)",
      placeholderText: "Enter crotch to ankle",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    waistToAnkle: {
      label: "Waist to Ankle (Length of Pants)",
      placeholderText: "waist to ankle",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    waistToFloor: {
      label: "Waist to Floor (Length of Dress)",
      placeholderText: "Enter waist to floor",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },

  {
    ankleSize: {
      label: "Ankle Size (For Shoes)",
      placeholderText: "Enter your ankle size",
      // icon: TbRulerMeasure,
      variant: "number",
    },
  },
  {
    quantity: {
      label: "Quantity",
      placeholderText: "Enter quantity",
      icon: PiBasket,
      variant: "number",
    },
  },
  {
    deliveryDate: {
      label: "Delivery Date",
      placeholderText: "Select delivery date",
      icon: FiCalendar,
      variant: "date",
    },
  },
  {
    spacer1: {
      label: " ",
      placeholderText: " ",
      variant: "hidden",
    },
  },
  {
    notes: {
      label: "Additional Information",
      placeholderText:
        "Describe any additional information you would like to provide",
      variant: "textarea",
      classes: {
        formItem: "flex flex-col items-start w-full",
      },
      span: true,
    },
  },
];

const formSchema = z.object({
  waistSize: z.coerce.number().min(0, { message: "Waist size is required" }),
  chestSize: z.coerce.number().min(0, { message: "Chest size is required" }),
  height: z.coerce
    .number()
    .min(0, { message: "Height is required" })
    .nullable(),
  notes: z
    .string()
    .max(1000, { message: "Maximum character length exceeded" })
    .optional(),
  quantity: z.coerce
    .number()
    .min(0, { message: "Stock must be a positive number" })
    .max(4, {
      message: "Maximum quantity is 4",
    }),

  deliveryDate: z.date(),
});

const handleSuccess = async (details) => {
  // Handle successful payment (e.g., save order, show confirmation)
  console.log("Payment successful!", details);
  await sendEmail({
    to: process.env.SMTP_EMAIL,
    subject: "New Order Received",
    html: `
      <div>
        <p>Hey Admin,</p>
        <p>You have a new order from ${details.payer.name.given_name} ${details.payer.name.surname}.</p>
        <h3>Order Details</h3>
        <p><strong>Product:</strong>stuff</p>
        <p><strong>Amount:</strong> ${details.purchase_units[0].amount.value} ${details.purchase_units[0].amount.currency_code}</p>
      </div>
    `,
  });
};

const OrderDetailsPage = () => {
  const currentProduct = useAppSelector(
    (state) => state.products.currentProduct
  );
  const form = useForm<
    z.infer<typeof formSchema>,
    any,
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
  });
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p>
          Fill out the form below to place your order for {currentProduct?.name}
        </p>
        <p>
          Nunc porttitor porttitor ante vitae suscipit. Donec pretium purus et
          est aliquet tempor. Mauris maximus et dolor pulvinar fringilla. In
          dignissim eros porta felis laoreet mollis. Aliquam erat volutpat.
          Etiam mollis ex ut quam pretium, eget ullamcorper erat blandit. In a
          libero eget orci malesuada ornare. Praesent vulputate eros quis quam
          aliquet, pulvinar luctus justo aliquam.
        </p>
      </div>

      <div className="flex flex-wrap flex-row gap-y-4 items-start w-full">
        {formFields.map((field, index) => {
          const [name, props] = Object.entries(field)[0];

          switch (field.variant) {
            case "date":
              return (
                <div>Date</div>

                // <Popover key={name}>
                //   <PopoverTrigger asChild>
                //     <div className="relative w-full">
                //       <FiCalendar
                //         size={20}
                //         className="absolute right-2 top-1/2 transform -translate-y-1/2"
                //       />
                //       <Input
                //         type="text"
                //         placeholder={placeholderText || "Select a date"}
                //         value={
                //           (field?.value &&
                //             new Date(field?.value).toLocaleDateString()) ||
                //           ""
                //         }
                //         readOnly
                //         className="w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent"
                //       />
                //     </div>
                //   </PopoverTrigger>
                //   <PopoverContent className="w-auto p-0 !bg-white">
                //     <Calendar
                //       defaultMonth={defaultDate()}
                //       selected={field.value ? new Date() : undefined}
                //       mode="single"
                //       onSelect={(date, day, mod, e) => {
                //         if (date) {
                //           field.onChange(date);
                //           form.setValue("deliveryDate", date, {
                //             shouldValidate: true,
                //           });
                //         }
                //       }}
                //     />
                //   </PopoverContent>
                // </Popover>
              );
            case "textarea":
              return (
                <Textarea
                  key={name}
                  maxLength={1000}
                  placeholder="Describe any additional information you would like to provide"
                  className={`"w-full h-32 border-gray-300 focus-visible:ring-transparent shadow-none" ${
                    field?.classes?.control || ""
                  }`}
                  {...field}
                />
              );
              break;

            default:
              return (
                <div>Input</div>
                // <Input
                //   key={name}
                //   type={field.variant}
                //   placeholder={field.placeholderText}
                //   className={`"w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent" ${
                //     field?.classes?.control || ""
                //   }`}
                //   {...field}
                //   onChange={(e) => {
                //     if (e.target.value) {
                //       form.setValue(rest?.name as string, e.target.value, {
                //         shouldValidate: true,
                //       });
                //     } else {
                //       form.setValue(rest?.name as string, "", {
                //         shouldValidate: false,
                //       });
                //     }
                //   }}
                // />
              );
          }
          // return (
          //   <FField
          //     key={name}
          //     form={form}
          //     name={name}
          //     {...props}
          //     classes={{ formItem: "px-4" }}
          //   />
          // );
        })}
      </div>

      <PayPalProvider>
        <PayPalButton amount="22.50" onSuccess={handleSuccess} />
      </PayPalProvider>
    </div>
  );
};

export default OrderDetailsPage;
