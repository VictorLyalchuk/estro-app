// export const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'long',
//       year: 'numeric'
//     });
//   };
  export const formatDate = (dateString: string, locale: string = 'en-GB') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };