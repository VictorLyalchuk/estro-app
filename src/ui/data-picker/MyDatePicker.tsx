import React from 'react';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// const CustomDatePicker = styled(DatePicker)(({ theme }) => ({
//   '& .MuiOutlinedInput-root': {
//     '& fieldset': {
//       border: 'none',
//     },
//     '& input': {
//       borderBottom: `1px solid ${theme.palette.text.primary}`,
//     },
//   },
// }));

const MyDatePicker: React.FC = () => {
  // const [selectedDate, setSelectedDate] = useState<string>('');
  const { i18n } = useTranslation();
  const getLocale = () => {
    switch (i18n.language) {
      case 'uk':
        return 'uk';
      case 'es':
        return 'es';
      case 'fr':
        return 'fr';
      default:
        return 'en-gb'; 
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={getLocale()}>
      {/* <CustomDatePicker
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      /> */}
    </LocalizationProvider>
  );
};

export default MyDatePicker;