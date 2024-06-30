import { FormControl, TextField } from '@material-ui/core';

interface TextFieldComponentProps {
    label: string;
    name: string;
    id: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    autoComplete: string;
    maxLength: number;
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({ label, name, id, value, onChange, error, autoComplete, maxLength }) => (
        <FormControl fullWidth >
            <TextField
                variant="standard"
                label={label}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                error={!!error}
                autoComplete={autoComplete}
                inputProps={{
                    maxLength: maxLength 
                }}
            />
            {error ? (
                <div className="h-6 text-xs text-red-500">Error: {error}</div>
            ) : (
                <div className="h-6 text-xs"> </div>
            )}
        </FormControl>
);

export default TextFieldComponent;
