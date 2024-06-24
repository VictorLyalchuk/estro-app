import { FormControl, TextField } from '@material-ui/core';

interface TextFieldNoLableComponentProps {
    name: string;
    id: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    autoComplete: string;
}

const TextFieldNoLableComponent: React.FC<TextFieldNoLableComponentProps> = ({ name, id, value, onChange, error, autoComplete }) => (
    <FormControl fullWidth >
        <TextField
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            error={!!error}
            autoComplete={autoComplete}
            className="mt-1"
            size="small"
        />
        {error ? (
            <div className="h-6 text-xs text-red-500">Error: {error}</div>
        ) : (
            <div className="h-6 text-xs"> </div>
        )}
    </FormControl>
);

export default TextFieldNoLableComponent;
