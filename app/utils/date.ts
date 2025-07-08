const currentDate = new Date();

/*
 * Utility function to get the default date for order details.
 * This function returns a date that is 'n' days from today.
 */
interface FormatDateProps {
  offset?: number; // Number of days to offset from today
  date?: Date; // Optional date to format, defaults to today
}

export const formatDate = ({ offset = 0, date }: FormatDateProps): Date => {
  const currentDate = date ?? new Date();
  currentDate.setDate(currentDate.getDate() + offset);

  return currentDate;
};

export const offsetDate = (offset?: number) =>
  new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + (offset || 7)
  );
