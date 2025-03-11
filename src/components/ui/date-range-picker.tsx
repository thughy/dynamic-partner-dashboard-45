
import * as React from "react"
import { addDays, format, startOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  onSelect?: (dateRange: { from: Date | undefined; to: Date | undefined }) => void;
}

export function DatePickerWithRange({
  className,
  onSelect,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    // Default to current week (Monday to Sunday)
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
    const sunday = addDays(monday, 6);
    
    return {
      from: monday,
      to: sunday,
    };
  });

  // When date changes, call onSelect callback if provided
  React.useEffect(() => {
    if (onSelect && date) {
      onSelect({
        from: date.from,
        to: date.to || date.from // Ensure 'to' is never undefined if 'from' is selected
      });
    }
  }, [date, onSelect]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
            weekStartsOn={1} // Make weeks start on Monday
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
