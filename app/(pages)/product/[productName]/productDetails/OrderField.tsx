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

export type Variant = "number" | "textarea" | "text" | "date" | "hidden";

export type Field = {
  label: string;
  placeholderText: string;
  variant: Variant;
  icon?: any;
  classes?: { formItem: string };
  span?: boolean;
  name?: string;
  value?: string | number | Date | null;
  error?: string;
};

export const OrderField = ({
  onValidation,
  ...props
}: Field & {
  onValidation?: (
    fieldName: string,
    value: ZodError | string | Date | null
  ) => boolean;
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
                selected={new Date(value)}
                mode="single"
                onSelect={(date, day, mod, e) => {
                  if (date) {
                    setValue(date.toISOString());

                    if (props.name) {
                      try {
                        z.object({
                          [props.name]: fieldSchema.shape[props.name],
                        }).parse({ [props.name]: date });
                        setError(null);
                        onValidation?.(props.name, date);
                      } catch (error) {
                        setError(error);
                        onValidation?.(props.name, error as ZodError);
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
                  onValidation?.(props.name, e.target.value);
                } catch (error) {
                  setError(error);
                  onValidation?.(props.name, error as ZodError);
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

                    onValidation?.(props.name, e.target.value);
                  } catch (error) {
                    setError(error);
                    onValidation?.(props.name, error as ZodError);
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
