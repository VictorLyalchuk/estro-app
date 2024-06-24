import React from 'react';
import { FormControl, TextField } from '@material-ui/core';

interface BirthdayFieldComponentProps {
    birthday: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BirthdayComponent: React.FC<BirthdayFieldComponentProps> = ({ birthday, handleChange }) => (
    <FormControl fullWidth variant="outlined">
        <TextField
            name="birthday"
            id="birthday"
            type="date"
            onChange={handleChange}
            value={birthday}
            InputLabelProps={{
                shrink: true,
            }}
            autoComplete="birthday"
            className="mt-1"
            size="small"
        />
    </FormControl>
);

export default BirthdayComponent;
