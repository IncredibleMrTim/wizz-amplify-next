import { createElement, ReactNode } from "react";
import { FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Controller,
  UseFormProps,
  ControllerProps,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { IconType } from "react-icons";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { FiCalendar } from "react-icons/fi";

interface UseFormFieldProps extends Partial<ControllerProps> {
  form: UseFormProps<any>["context"];
  span?: boolean;
  variant?: "number" | "textarea" | "text" | "date" | "hidden";
  placeholder?: string;
  label?: string;
  customControl?: ReactNode;
  children?: ReactNode;
  icon?: IconType;
  placeholderText?: string;
  shouldValidateOnChange?: boolean;
  classes?: {
    formItem?: string;
    formLabel?: string;
    formControl?: string;
    control?: string;
    controlContainer?: string;
    icon?: string;
  };
}

// TODO: this needs to be relative to the  current lead time of products
const defaultDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 7); // Set default date to 7 days from today
  return today;
};

export const FormField = ({
  form,
  variant = "text",
  customControl,
  classes,
  icon,
  shouldValidateOnChange = true,
  placeholderText,
  label,
  children,
  span,
  ...rest
}: UseFormFieldProps) => {
  const renderVariant = (
    variant: UseFormFieldProps["variant"],
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    switch (variant) {
      case "textarea":
        return (
          <>
            <Textarea
              maxLength={1000}
              placeholder="Describe any additional information you would like to provide"
              className={`"w-full h-32 border-gray-300 focus-visible:ring-transparent shadow-none" ${
                classes?.control || ""
              }`}
              {...field}
            />
          </>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <FiCalendar
                  size={20}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  type="text"
                  placeholder={placeholderText || "Select a date"}
                  value={
                    (field?.value &&
                      new Date(field?.value).toLocaleDateString()) ||
                    ""
                  }
                  readOnly
                  className="w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 !bg-white">
              <Calendar
                defaultMonth={defaultDate()}
                selected={field.value ? new Date() : undefined}
                mode="single"
                onSelect={(date, day, mod, e) => {
                  if (date) {
                    field.onChange(date);
                    form.setValue("deliveryDate", date, {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        );
      default:
        return (
          <>
            {icon &&
              createElement(icon, {
                className: `absolute right-2 top-1/2 transform -translate-y-1/2 ${
                  classes?.icon || ""
                }`,
                size: 20,
              })}
            <Input
              type={variant}
              placeholder={placeholderText}
              className={`"w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent" ${
                classes?.control || ""
              }`}
              {...field}
              onChange={(e) => {
                if (e.target.value) {
                  form.setValue(rest?.name as string, e.target.value, {
                    shouldValidate: true,
                  });
                } else {
                  form.setValue(rest?.name as string, "", {
                    shouldValidate: false,
                  });
                }
              }}
            />
          </>
        );
    }
  };

  return (
    <Controller
      name={rest?.name as string}
      control={form.control}
      {...rest}
      render={({ field }) => {
        return (
          <FormItem
            className={`flex flex-col items-start ${span ? "w-full" : "w-1/2"} ${
              classes?.formItem || ""
            }`}
          >
            {label && (
              <FormLabel className={classes?.formLabel || ""}>
                {label}
              </FormLabel>
            )}
            <FormControl className="relative">
              <div
                className={`relative w-full ${classes?.controlContainer || ""}`}
              >
                {!customControl && renderVariant(variant, field)}
                {children}
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};
