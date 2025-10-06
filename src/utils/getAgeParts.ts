import type { AgeParts } from "../types/age";

export const getAgeParts = (birthDate: Date, now: Date): AgeParts => {
  // Clone to avoid mutating inputs
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  // Adjust if current month/day hasn’t reached birthday yet
  if (days < 0) {
    // borrow days from previous month
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  // Get time-of-day difference
  const birthTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    birthDate.getHours(),
    birthDate.getMinutes(),
    birthDate.getSeconds(),
    birthDate.getMilliseconds()
  );

  const diffMs = now.getTime() - birthTime.getTime();
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);
  const milliseconds = diffMs % 1000;

  return { years, months, days, hours, minutes, seconds, milliseconds };
};
