function today() {
  const date = new Date();
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).toISOString();
  return Date.parse(newDate);
}

function thirtyDaysLater() {
  const date = new Date();
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 30
  ).toISOString();
  return Date.parse(newDate);
}

function firstDayOfMonth() {
  const date = new Date();
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  ).toISOString();
  return Date.parse(newDate);
}

function lastDayOfMonth() {
  const date = new Date();
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).toISOString();
  return Date.parse(newDate);
}

function lastDayOfNextMonth() {
  const date = new Date();
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth() + 2,
    0,
  ).toISOString();
  return Date.parse(newDate);
}

function firstDay(year, month) {
  const newDate = new Date(
    year,
    month - 1,
    1,
  ).toISOString();
  return Date.parse(newDate);
}

function lastDay(year, month) {
  const newDate = new Date(
    year,
    month,
    0,
  ).toISOString();
  return Date.parse(newDate);
}

export default {
  today,
  firstDayOfMonth,
  lastDayOfMonth,
  thirtyDaysLater,
  lastDayOfNextMonth,
  firstDay,
  lastDay,
};
