import { parse } from "date-fns";

export const cleanDateString = (dateText: string): string => {
  // Remove trailing punctuation, ordinal suffixes and clean up the string
  return dateText
    .toLowerCase()
    .replace(/[.,!?]+$/, '') // Remove trailing punctuation
    .replace(/(\d+)(st|nd|rd|th)/, "$1")
    .replace(/\s+/g, " ")
    .trim();
};

export const parseDate = (dateText: string): Date => {
  const cleanedDate = cleanDateString(dateText);
  console.log("Attempting to parse date:", cleanedDate);
  
  const formats = [
    "MMMM d yyyy",
    "MMMM d",
    "MMM d yyyy",
    "MMM d",
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "MM-dd-yyyy",
    "MMMM d, yyyy",
    "MMM d, yyyy"
  ];

  let lastError = null;

  for (const format of formats) {
    try {
      const parsedDate = parse(cleanedDate, format, new Date());
      if (!isNaN(parsedDate.getTime())) {
        // If year is not specified, use current year
        if (!dateText.includes(new Date().getFullYear().toString())) {
          parsedDate.setFullYear(new Date().getFullYear());
        }
        console.log("Successfully parsed date:", parsedDate);
        return parsedDate;
      }
    } catch (error) {
      lastError = error;
      console.log(`Failed to parse with format ${format}:`, error);
    }
  }
  
  console.error("Final parsing error:", lastError);
  throw new Error(`Could not parse date: ${dateText}. Please use a format like "December 25" or "Dec 25"`);
};