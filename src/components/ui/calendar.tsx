import * as React from "react";
import { ChevronLeft, ChevronRight, Sun, Moon, Languages } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Locale } from "date-fns";

// Amharic translations
const amharicTranslations = {
  months: [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ",
    "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ",
    "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ],
  weekdays: [
    "እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ",
    "ሐሙስ", "ዓርብ", "ቅዳሜ"
  ],
  weekdaysShort: ["እሑ", "ሰኞ", "ማክ", "ረቡ", "ሐሙ", "ዓር", "ቅዳ"],
  weekStartsOn: 0 as const
};

// Amharic locale (custom)
const amharicLocale: Locale = {
  code: "am",
  formatDistance: () => "",
  formatLong: {
    date: () => "PPP",
    time: () => "p",
    dateTime: () => "PPP p",
  },
  formatRelative: () => "",
  localize: {
    ordinalNumber: (n: number) => `${n}`,
    era: (value: 0 | 1) => (value === 0 ? "ዓ/ዓ" : "ዓ/ም"),
    quarter: (value: 1 | 2 | 3 | 4) => `ሩብ ${value}`,
    month: (value: number) => amharicTranslations.months[value],
    day: (value: number) => amharicTranslations.weekdays[value],
    dayPeriod: (period: "am" | "pm" | "midnight" | "noon" | "morning" | "afternoon" | "evening" | "night") =>
      period === "am" ? "ጥዋት" : "ከሰዓት በኋላ",
  },
  match: {
    ordinalNumber: (str: string) => ({ value: parseInt(str), rest: "" }),
    era: () => ({ value: 1 as const, rest: "" }), // 1 = "AD"
    quarter: () => ({ value: 1 as const, rest: "" }),
    month: () => ({ value: 0 as const, rest: "" }),
    day: () => ({ value: 0 as const, rest: "" }),
    dayPeriod: () => ({ value: "am" as const, rest: "" }),
  },
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1,
  },
};


export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  darkMode?: boolean;
  defaultAmharic?: boolean;
  withLanguageToggle?: boolean;
  withDarkModeToggle?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  darkMode = false,
  defaultAmharic = false,
  withLanguageToggle = false,
  withDarkModeToggle = false,
  ...props
}: CalendarProps) {
  const [isAmharic, setIsAmharic] = React.useState(defaultAmharic);
  const [isDarkMode, setIsDarkMode] = React.useState(darkMode);

  return (
    <div className={cn("relative", isDarkMode ? "dark" : "")}>
      {/* Controls */}
      {(withLanguageToggle || withDarkModeToggle) && (
        <div className="flex gap-2 mb-4 justify-end">
          {withLanguageToggle && (
            <button
              onClick={() => setIsAmharic(!isAmharic)}
              className={cn(
                "p-2 rounded-full",
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-200"
              )}
              aria-label={isAmharic ? "ቋንቋ ቀይር" : "Change language"}
            >
              <Languages className="h-4 w-4" />
            </button>
          )}
          {withDarkModeToggle && (
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "p-2 rounded-full",
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-200"
              )}
              aria-label={isAmharic ? "የጨለማ ሞድ" : "Toggle dark mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </div>
      )}

      {/* Calendar */}
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={isAmharic ? amharicLocale : undefined}
        weekStartsOn={isAmharic ? amharicTranslations.weekStartsOn : 1}
        className={cn(
          "p-3 rounded-lg border",
          isDarkMode
            ? "bg-gray-900 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-900",
          className
        )}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: cn(
            "text-sm font-medium",
            isDarkMode ? "text-gray-100" : "text-gray-900"
          ),
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 p-0",
            isDarkMode
              ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              : "bg-transparent hover:bg-gray-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: cn(
            "rounded-md w-9 font-normal text-[0.8rem]",
            isDarkMode ? "text-gray-400" : "text-muted-foreground"
          ),
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            isDarkMode
              ? "hover:bg-gray-800 hover:text-gray-100"
              : "hover:bg-gray-100 hover:text-gray-900"
          ),
          day_range_end: "day-range-end",
          day_selected: cn(
            "text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            isDarkMode ? "bg-blue-600" : "bg-blue-500"
          ),
          day_today: cn(
            "text-accent-foreground",
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          ),
          day_outside: cn(
            "opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            isDarkMode ? "text-gray-500" : "text-muted-foreground"
          ),
          day_disabled: cn(
            "opacity-50",
            isDarkMode ? "text-gray-600" : "text-muted-foreground"
          ),
          day_range_middle: cn(
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          ),
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => (
            <ChevronLeft className={cn(
              "h-4 w-4",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )} />
          ),
          IconRight: ({ ..._props }) => (
            <ChevronRight className={cn(
              "h-4 w-4",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )} />
          ),
        }}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";
export { Calendar };
