export const formatDateTime = (dateString: string | null) => {
  if (!dateString) return null;
  
  // Use a fixed locale and options for consistency between server and client
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
} 