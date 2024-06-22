import { FormControl, TextField, TextFieldProps } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { JSX } from "react/jsx-runtime";
import { IStore } from '../../../../../interfaces/Catalog/IStore';
import '../../../../../satoshi.css';

interface StoreShippingProps {
  storeCities: string[];
  filteredStores: IStore[];
  handleChangeStoreCity: (event: React.ChangeEvent<{}>, value: string | null) => void;
  handleChangeStore: (event: React.ChangeEvent<{}>, value: IStore | null) => void;
  warehouseSelected: boolean;
  selectedStoreCity: string | null;
  selectedStore: IStore | null;
  errors: { city?: string; warehouse?: string };
}

const StoreShipping: React.FC<StoreShippingProps> = ({ storeCities, filteredStores, handleChangeStoreCity, handleChangeStore, warehouseSelected, selectedStoreCity, selectedStore, errors }) => (
  <div className="mt-5">
    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
      City
    </label>

    <FormControl fullWidth variant="outlined">
      <Autocomplete
        id="city"
        options={storeCities}
        onChange={handleChangeStoreCity}
        value={selectedStoreCity}
        renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          <TextField
            {...params}
            fullWidth
            size="small"
            error={!!errors.city}
          />
        )}
      />
      {errors.city ? (
        <div className="h-6 text-xs text-red-500">Error: {errors.city}</div>
      ) : (<div className="h-6 text-xs "> </div>)}
    </FormControl>
    <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-2">
      Store
    </label>
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        id="store"
        options={filteredStores}
        getOptionLabel={(option) => option.name}
        value={selectedStoreCity ? selectedStore : null}
        onChange={handleChangeStore}
        disabled={!warehouseSelected}
        renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          <TextField
            {...params}
            fullWidth
            size="small"
            error={!!errors.warehouse}
          />
        )}
      />
      {errors.warehouse ? (
        <div className="h-6 text-xs text-red-500">Error: {errors.warehouse}</div>
      ) : (<div className="h-6 text-xs "> </div>)}
    </FormControl>
  </div>
);

export default StoreShipping;