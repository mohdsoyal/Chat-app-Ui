export function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diff = Math.floor((now - past) / 1000); // in seconds

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

  return past.toLocaleDateString(); // fallback to date
}
