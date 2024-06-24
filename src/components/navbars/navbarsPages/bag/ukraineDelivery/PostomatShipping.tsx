import { FormControl, TextField, TextFieldProps } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { JSX } from "react/jsx-runtime";
import { ICity } from '../../../../../interfaces/Bag/ICity';
import { IWarehouse } from '../../../../../interfaces/Bag/IWarehouse';
import '../../../../../satoshi.css';

interface PostomatShippingProps {
    cityOptions: ICity[];
    warehouseOptions: IWarehouse[];
    handleChangeCity: (event: React.ChangeEvent<{}>, value: ICity | null) => void;
    handleChangeWarehouse: (event: React.ChangeEvent<{}>, value: IWarehouse | null) => void;
    warehouseSelected: boolean;
    selectedWarehouseOptions: IWarehouse | null;
    errors: { city?: string; warehouse?: string };
}

const PostomatShipping: React.FC<PostomatShippingProps> = ({ cityOptions, warehouseOptions, handleChangeCity, handleChangeWarehouse, warehouseSelected, selectedWarehouseOptions, errors }) => (

    <div className="mt-5">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City
        </label>

        <FormControl fullWidth>
            <Autocomplete
                id="city"
                options={cityOptions.filter(option => option.SettlementTypeDescription === 'місто')}
                getOptionLabel={(option) => option.Description}
                onChange={handleChangeCity}
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

        <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-2">
            Postomat
        </label>

        <FormControl fullWidth>
            <Autocomplete
                id="warehouse"
                options={warehouseOptions.filter(option => option.CategoryOfWarehouse === 'Postomat')}
                getOptionLabel={(option) => option.Description}
                value={warehouseOptions.find(option => option.CityRef === selectedWarehouseOptions?.CityRef) || null}
                onChange={handleChangeWarehouse}
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

export default PostomatShipping;