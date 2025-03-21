import type { AgeParts } from "../types/age";

export const getAgeParts = (birthDate: Date, now: Date): AgeParts => {
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  // Last birthday (March 31)
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

  // Subtract the month offset to find remaining time
  const monthStart = new Date(lastBirthday);
  monthStart.setMonth(monthStart.getMonth() + months);

  const diff = now.getTime() - monthStart.getTime();
  const diffDate = new Date(diff);

  const days = diffDate.getUTCDate() - 1;
  const hours = diffDate.getUTCHours();
  const minutes = diffDate.getUTCMinutes();
  const seconds = diffDate.getUTCSeconds();
  const milliseconds = diffDate.getUTCMilliseconds();

  return { years, months, days, hours, minutes, seconds, milliseconds };
};
