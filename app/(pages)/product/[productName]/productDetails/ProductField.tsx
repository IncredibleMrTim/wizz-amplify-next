import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import z, { ZodError } from "zod";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/utils/date";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { fieldSchema } from "./fields";
import moment from "moment";
import { offsetDate } from "@/utils/date";

export type Variant =
  | "number"
  | "textarea"
  | "text"
  | "date"
  | "hidden"
  | "error";
export interface onValidationProps {
  fieldName: string;
  value: ZodError | string | number | Date;
  type?: Variant;
}

export type Field = {
  label: string;
  placeholderText: string;
  variant: Variant;
  icon?: any;
  classes?: { formItem: string };
  span?: boolean;
  name?: string;
  value?: string | number | null;
  error?: string;
  required?: boolean;
};

export const ProductField = ({
  onValidation,
  ...props
}: Field & {
  onValidation?: (props: onValidationProps) => void;
}) => {
  const [value, setValue] = useState<Date | string | undefined | null>(null);
  const [error, setError] = useState<ZodError | null>(null);

  const renderComponent = () => {
    switch (props.variant) {
      case "date":
        return (
          <Popover key={props.label}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <FiCalendar
                  size={20}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  type="text"
                  placeholder={props.placeholderText || "Select a date"}
                  value={
                    value
                      ? moment(formatDate({ date: new Date(value) })).format(
                          "DD/MM/YYYY"
                        )
                      : moment(formatDate({ offset: 7 })).format("DD/MM/YYYY")
                  }
                  readOnly
                  className="w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 !bg-white">
              <Calendar
                defaultMonth={null}
                startMonth={offsetDate(7)}
                selected={value ? new Date(value) : null}
                mode="single"
                disabled={(date) => date < offsetDate(7)}
                onSelect={(date) => {
                  if (date) {
                    setValue(date.toISOString());

                    if (props.name) {
                      try {
                        z.object({
                          [props.name]: fieldSchema.shape[props.name],
                        }).parse({ [props.name]: date });
                        setError(null);
                        onValidation?.({
                          fieldName: props.name || "",
                          value: date,
                          type: props.variant,
                        });
                      } catch (error) {
                        setError(error);
                        onValidation?.({
                          fieldName: props.name || "",
                          value: error as ZodError,
                          type: "error",
                        });
                      }
                    }
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        );
      case "textarea":
        return (
          <Textarea
            key={props.label}
            maxLength={1000}
            placeholder={props.placeholderText}
            className={`w-full h-32 border-gray-300 focus-visible:ring-transparent shadow-none ${props?.classes?.formItem || ""}`}
            onBlur={(e) => {
              if (props.name) {
                try {
                  z.object({
                    [props.name]: fieldSchema.shape[props.name],
                  }).parse({ [props.name]: e.target.value });
                  setError(null);
                  onValidation?.({
                    fieldName: props.name,
                    value: e.target.value,
                    type: props.variant,
                  });
                } catch (error) {
                  setError(error);
                  onValidation?.({
                    fieldName: props.name,
                    value: error as ZodError,
                    type: "error",
                  });
                }
              }
            }}
          />
        );
      case "hidden":
        return null;
      default:
        return (
          <div key={props.label}>
            <Input
              key={props.label}
              type={props.variant}
              placeholder={props.placeholderText}
              className="w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent"
              onChange={(e) => {
                if (e.target.value) {
                  setValue(e.target.value);
                }
              }}
              onBlur={(e) => {
                if (props.name) {
                  try {
                    z.object({
                      [props.name]: fieldSchema.shape[props.name],
                    }).parse({ [props.name]: e.target.value });
                    setError(null);

                    onValidation?.({
                      fieldName: props.name,
                      value: e.target.value,
                      type: props.variant,
                    });
                  } catch (error) {
                    setError(error);
                    onValidation?.({
                      fieldName: props.name || "",
                      value: error as ZodError,
                      type: "error",
                    });
                  }
                }
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full relative">
      {renderComponent()}
      {error && (
        <div className="absolute -bottom-6 text-sm left-3 text-red-400">
          {props.error}
        </div>
      )}
    </div>
  );
};
