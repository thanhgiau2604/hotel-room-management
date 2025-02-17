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
