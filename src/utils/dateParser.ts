import { parse } from "date-fns";

export const cleanDateString = (dateText: string): string => {
  // Remove ordinal suffixes (st, nd, rd, th) and clean up the string
  return dateText
    .toLowerCase()
    .replace(/(\d+)(st|nd|rd|th)/, "$1")
    .replace(/\s+/g, " ")
    .trim();
};

export const parseDate = (dateText: string): Date => {
  const cleanedDate = cleanDateString(dateText);
  console.log("Cleaned date string:", cleanedDate);
  
  const formats = [
    "MMMM d yyyy",
    "MMMM d",
    "MMM d yyyy",
    "MMM d",
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "MM-dd-yyyy"
  ];

  for (const format of formats) {
    try {
      const parsedDate = parse(cleanedDate, format, new Date());
      if (!isNaN(parsedDate.getTime())) {
        // If year is not specified, use current year
        if (!dateText.includes(new Date().getFullYear().toString())) {
          parsedDate.setFullYear(new Date().getFullYear());
        }
        return parsedDate;
      }
    } catch (error) {
      console.log(`Failed to parse with format ${format}:`, error);
    }
  }
  
  throw new Error("Invalid date format");
};