export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('id-ID');
};

export const formatRelative = (date) => {
  if (!date) return '-';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return mins + ' menit lalu';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + ' jam lalu';
  return Math.floor(hours / 24) + ' hari lalu';
};

export const formatDistanceToNow = (date) => formatRelative(date);

export default { formatDate, formatDateTime, formatRelative, formatDistanceToNow };

export const formatTime = (date) => { if (!date) return '-'; return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); };
