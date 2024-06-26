import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { IStore } from '../../../../../interfaces/Catalog/IStore';
import '../../../../../satoshi.css';
import { ICity } from '../../../../../interfaces/Address/ICity';
import { ICountry } from '../../../../../interfaces/Address/ICountry';

interface StoreShippingProps {
  countryOptions: ICountry[] | null;
  cityOptions: ICity[] | null;
  handleChangeShipping: (event: React.ChangeEvent<HTMLInputElement>) => void;
  shippingData: { country: string, city: string, state: string, street: string, }
  storeOptions: IStore[];
  errors: { country?: string; city?: string; street?: string };
}

const StoreShipping: React.FC<StoreShippingProps> = ({countryOptions, cityOptions, shippingData, handleChangeShipping, storeOptions, errors }) => {
  const filteredCityOptions = cityOptions ? cityOptions.filter(city => city.countryName === shippingData.country) : [];
  const filteredStoreOptions = storeOptions.filter(store => store.city === shippingData.city);
  return (
    <div className="mt-5">
      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
        Country
      </label>
      <FormControl fullWidth variant="outlined">
        <TextField
          id="country"
          name="country"
          select
          value={shippingData.country}
          onChange={handleChangeShipping}
          error={!!errors.country}
        >
          {countryOptions && countryOptions.map((country, index) => (
            <MenuItem key={index} value={country.countryName}>
              {country.countryName}
            </MenuItem>
          ))}
        </TextField>
        {errors.country ? (
          <div className="h-6 text-xs text-red-500">Error: {errors.country}</div>
        ) : (<div className="h-6 text-xs "> </div>)}
      </FormControl>
      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
        City
      </label>
      <FormControl fullWidth variant="outlined">
        <TextField
          id="city"
          name="city"
          select
          value={shippingData.city}
          onChange={handleChangeShipping}
          error={!!errors.city}
          disabled={!shippingData.country}
        >
          {filteredCityOptions && filteredCityOptions.map((city, index) => (
            <MenuItem key={index} value={city.cityName}>
              {city.cityName}
            </MenuItem>
          ))}
        </TextField>
        {errors.city ? (
          <div className="h-6 text-xs text-red-500">Error: {errors.city}</div>
        ) : (<div className="h-6 text-xs "> </div>)}
      </FormControl>

      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
        Store
      </label>
      <FormControl fullWidth variant="outlined">
        <TextField
          id="street"
          name="street"
          select
          value={shippingData.street}
          onChange={handleChangeShipping}
          error={!!errors.street}
          disabled={!shippingData.city}
        >
          {filteredStoreOptions && filteredStoreOptions.map((store, index) => (
            <MenuItem key={index} value={`${store.name} ${store.address}`}>
              {`${store.name} ${store.address}`}
            </MenuItem>
          ))}
        </TextField>
        {errors.street ? (
          <div className="h-6 text-xs text-red-500">Error: {errors.street}</div>
        ) : (<div className="h-6 text-xs "> </div>)}
      </FormControl>
    </div>
  );
};

export default StoreShipping;