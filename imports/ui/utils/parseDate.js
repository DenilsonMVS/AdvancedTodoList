
export function formatDateTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function dateFromDateTimeString(dateStr) {
  const [datePart, timePart] = dateStr.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  return new Date(year, month - 1, day, hours, minutes);
}

export function dateFromDateString(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return new Date(year, month - 1, day);
}
