import type { AgeParts } from "../types/age";

export const getAgeParts = (birthDate: Date, now: Date): AgeParts => {
  const birthMonth = birthDate.getMonth(); // March = 2
  const birthDay = birthDate.getDate();

  const thisYearBirthday = new Date(now.getFullYear(), birthMonth, birthDay);
  const lastBirthday =
    now >= thisYearBirthday
      ? thisYearBirthday
      : new Date(now.getFullYear() - 1, birthMonth, birthDay);

  const years = lastBirthday.getFullYear() - birthDate.getFullYear();

  // Start from lastBirthday and move month by month until we reach "now"
  let temp = new Date(lastBirthday);
  let months = 0;

  while (
    temp.getFullYear() < now.getFullYear() ||
    (temp.getFullYear() === now.getFullYear() && temp.getMonth() < now.getMonth())
  ) {
    temp.setMonth(temp.getMonth() + 1);
    if (temp <= now) months++;
  }


  // Create a base date to calculate the diff (time since last birthday)
  const diff = now.getTime() - lastBirthday.getTime();
  const tempDate = new Date(diff); // epoch + delta

  // const months = now.getMonth() - lastBirthday.getMonth() + (now.getFullYear() - lastBirthday.getFullYear()) * 12;
  const days = tempDate.getUTCDate() - 1;
  const hours = tempDate.getUTCHours();
  const minutes = tempDate.getUTCMinutes();
  const seconds = tempDate.getUTCSeconds();
  const milliseconds = tempDate.getUTCMilliseconds();

  return {
    years,
    months: months % 12,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
};
