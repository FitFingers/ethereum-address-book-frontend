export default function formatTimestamp(s) {
  const ms = s * 1000;
  let temp = Math.floor(ms / 1000);

  const parts = [];

  const years = Math.floor(temp / 31536000);
  if (years) parts.push(years + "Y");

  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) parts.push(days + "D");

  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) parts.push(hours + "H");

  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) parts.push(minutes + "m");

  const seconds = temp % 60;
  if (seconds) parts.push(seconds + "s");

  if (!parts.length) parts.push("<1s");

  return parts.join(" ");
}
