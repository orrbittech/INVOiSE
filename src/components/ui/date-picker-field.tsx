"use client";

import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerFieldProps = {
  value: string;
  onChange: (isoDate: string) => void;
  placeholder?: string;
  className?: string;
};

export function DatePickerField({
  value,
  onChange,
  placeholder = "Pick date",
  className,
}: DatePickerFieldProps) {
  const selected = value ? parseISO(value) : undefined;
  const display =
    selected && isValid(selected) ? format(selected, "yyyy/MM/dd") : null;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm font-normal transition-colors outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          !display && "text-muted-foreground italic",
          className,
        )}
      >
        <CalendarIcon className="size-4 shrink-0" />
        {display ?? placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected && isValid(selected) ? selected : undefined}
          onSelect={(date) => {
            if (date) onChange(format(date, "yyyy-MM-dd"));
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
