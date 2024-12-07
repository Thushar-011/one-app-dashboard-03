import { parse } from "date-fns";

export const cleanDateString = (dateText: string): string => {
  // Remove ordinal suffixes (st, nd, rd, th)
  return dateText.replace(/(\d+)(st|nd|rd|th)/, "$1").trim();
};

export const parseDate = (dateText: string): Date => {
  const cleanedDate = cleanDateString(dateText);
  
  try {
    // Try parsing with year first
    const dateWithYear = parse(cleanedDate, "MMMM d yyyy", new Date());
    if (!isNaN(dateWithYear.getTime())) {
      return dateWithYear;
    }
    
    // If that fails, try without year
    const dateWithoutYear = parse(cleanedDate, "MMMM d", new Date());
    if (!isNaN(dateWithoutYear.getTime())) {
      return dateWithoutYear;
    }
  } catch (error) {
    console.error("Error parsing date:", error);
  }
  
  throw new Error("Invalid date format");
};