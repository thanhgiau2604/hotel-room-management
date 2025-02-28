import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  format,
} from "date-fns";
import { Timestamp } from "firebase/firestore";

export function toCurrency(value: number) {
  if (typeof value !== "number") {
    return value;
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  });

  return formatter.format(value);
}

export function isValidNumber(input: string): boolean {
  // Check if the string is empty
  if (input.trim() === "") {
    return true;
  }

  const inputNumber = input.replaceAll("₫", "").replaceAll(",", "");

  // Use a regular expression to validate the string
  const numberRegex = /^[+-]?\d+(\.\d+)?$/;

  return numberRegex.test(inputNumber);
}

export function getImageUrl(path: string): string {
  const runtimeConfig = useRuntimeConfig();
  return `${runtimeConfig.public.supabase.url}/storage/v1/object/public/${path}`;
}

export function formatDate(date: Date): string {
  return format(new Date(date), "MM/dd/yyyy HH:mm:ss");
}

export function differenceBetweenDates(
  date1: Date,
  date2: Date
): { hours: number; days: number } {
  return {
    hours: Math.abs(
      differenceInMilliseconds(new Date(date2), new Date(date1)) /
        (1000 * 60 * 60)
    ),
    days: Math.abs(
      differenceInMilliseconds(new Date(date2), new Date(date1)) /
        (1000 * 60 * 60 * 24)
    ),
  };
}
