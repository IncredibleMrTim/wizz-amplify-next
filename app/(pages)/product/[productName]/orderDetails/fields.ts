import { FiCalendar } from "react-icons/fi";
import { PiBasket } from "react-icons/pi";
import { z } from "zod";

import { Field, Variant } from "./OrderField";

export const fieldSchema = z.object({
  waistSize: z.coerce.number().min(1),
  chestSize: z.coerce.number().min(1),
  hipSize: z.coerce.number().min(1),
  girth: z.coerce.number().min(1),
  headSize: z.coerce.number().min(1),
  neckSize: z.coerce.number().min(1),
  bicepSize: z.coerce.number().min(1),
  armpitToWrist: z.coerce.number().min(1),
  wristSize: z.coerce.number().min(1),
  inseam: z.coerce.number().min(1),
  waistToAnkle: z.coerce.number().min(1),
  waistToFloor: z.coerce.number().min(1),
  ankleSize: z.coerce.number().min(1),
  quantity: z.coerce.number().min(1).max(4),
  deliveryDate: z.date().refine((date) => date >= new Date()),
  height: z.coerce.number().min(1).nullable(),
  notes: z.string().max(1000).optional(),
});

export const fields: {
  [key: string]: Field;
}[] = [
  {
    chestSize: {
      label: "Chest Size (Circumference Around Chest)",
      placeholderText: "Enter chest size",
      // // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid chest size",
    },
  },
  {
    waistSize: {
      label: "Waist Size (Circumference Around Waist)",
      placeholderText: "Enter waist size",
      // // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid waist size",
    },
  },
  {
    hipSize: {
      label: "Hip Size (Circumference Around Hips)",
      placeholderText: "Enter hip size",
      // // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid hip size",
    },
  },
  {
    girth: {
      label: "Girth Measurement (Around the Body)",
      placeholderText: "Girth measurement",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid girth measurement",
    },
  },
  {
    headSize: {
      label: "Head Size (Hat Size)",
      placeholderText: "Enter head size",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid head size",
    },
  },
  {
    neckSize: {
      label: "Neck Size (Collar Size)",
      placeholderText: "Enter neck size",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid neck size",
    },
  },
  {
    bicepSize: {
      label: "Bicep Size (Upper Arm Circumference)",
      placeholderText: "Enter bicep size",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid bicep size",
    },
  },
  {
    armpitToWrist: {
      label: "Armpit to Wrist (Arm Length)",
      placeholderText: "Enter armpit to wrist",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid armpit to wrist measurement",
    },
  },
  {
    wristSize: {
      label: "Wrist Size",
      placeholderText: "Enter wrist size",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid wrist size",
    },
  },
  {
    inseam: {
      label: "Inseam (Crotch to Ankle Length)",
      placeholderText: "Enter crotch to ankle",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid inseam measurement",
    },
  },
  {
    waistToAnkle: {
      label: "Waist to Ankle (Length of Pants)",
      placeholderText: "waist to ankle",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid waist to ankle measurement",
    },
  },
  {
    waistToFloor: {
      label: "Waist to Floor (Length of Dress)",
      placeholderText: "Enter waist to floor",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid waist to floor measurement",
    },
  },
  {
    ankleSize: {
      label: "Ankle Size (For Shoes)",
      placeholderText: "Enter your ankle size",
      // icon: TbRulerMeasure,
      variant: "number",
      error: "Please enter a valid ankle size",
    },
  },
  {
    quantity: {
      label: "Quantity",
      placeholderText: "Enter quantity",
      icon: PiBasket,
      variant: "number",
      error: "Please enter a quantity (1-4)",
    },
  },
  {
    deliveryDate: {
      label: "Delivery Date",
      placeholderText: "Select delivery date",
      icon: FiCalendar,
      variant: "date",
      error: "Please select a valid delivery date",
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
