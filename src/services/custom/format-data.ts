export const formatDate = (dateString: string, locale: string = 'en-GB') => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const formatDateFromDate = (date?: Date | string) => {
  if (!date) return 'N/A';
  const validDate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(validDate.getTime())) return 'N/A';
  return validDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};