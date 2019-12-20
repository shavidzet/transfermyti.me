import { isNil } from "lodash";
import format from "date-fns/format";
import addHours from "date-fns/addHours";
import subHours from "date-fns/subHours";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";

export enum DateFormat {
  Short = "yyyy-MM-dd",
  Long = "yyyy-MM-dd'T'HH:mm:ss",
}

/**
 * Returns the first and last day of the year (in ISO format) for specifying
 * start and end date ranges for the whole year.
 * @param year Year to get start and end days for.
 * @param [dateFormat] Optional format to apply to date.
 */
export function firstAndLastDayOfYear(
  year: number,
  dateFormat?: DateFormat,
): { firstDay: string; lastDay: string } {
  const currentDate = new Date();
  currentDate.setFullYear(year);

  const firstDay = startOfYear(currentDate);
  const lastDay = endOfYear(currentDate);

  return {
    firstDay: formatDate(firstDay, dateFormat),
    lastDay: formatDate(lastDay, dateFormat),
  };
}

/**
 * Returns a formatted date based on the optional dateFormat or the result
 * of calling toISOString() on the specified date value.
 * @param dateValue Value of the date to format.
 * @param [dateFormat] Optional format to apply to the date.
 */
function formatDate(dateValue: Date, dateFormat?: DateFormat): string {
  if (!isNil(dateFormat)) {
    return format(dateValue, dateFormat);
  }

  // Determine the offset hours to get an accurate start and end time:
  const utcOffsetHours = dateValue.getTimezoneOffset() / 60;

  // In order to get the correct date/time, we need to ensure the toISOString()
  // doesn't return the UTC offset date/time. This either adds or subtracts
  // hours to ensure the times are accurate:
  const dateMathFunc = utcOffsetHours < 0 ? addHours : subHours;
  const updatedDate = dateMathFunc(dateValue, utcOffsetHours);

  return updatedDate.toISOString();
}