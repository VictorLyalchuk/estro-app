import React from 'react';
import { TextField, IconButton } from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';

interface HighlightsInputProps {
    highlights: string[];
    setHighlights: (highlights: string[]) => void;
    error: string | null;
}

const HighlightsInput: React.FC<HighlightsInputProps> = ({ highlights, setHighlights, error }) => {
    const handleChange = (index: number, value: string) => {
        const newHighlights = [...highlights];
        newHighlights[index] = value;
        setHighlights(newHighlights);
    };

    const handleAdd: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (highlights.length === 0 || highlights[highlights.length - 1] !== '') {
            setHighlights([...highlights, '']);
        }
    };

    const handleRemove = (index: number) => {
        const newHighlights = highlights.filter((_, i) => i !== index);
        setHighlights(newHighlights);
    };

    return (
        <div>
            {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center mb-2">
                    <TextField
                        value={highlight}
                        onChange={(e) => handleChange(index, e.target.value)}
                        label={`Highlight ${index + 1}`}
                        fullWidth
                        error={!!error}
                    />
                    <IconButton onClick={() => handleRemove(index)} color="secondary">
                        <RemoveIcon />
                    </IconButton>
                </div>
            ))}
            {error ? (
                <div className="h-6 text-xs text-red-500">Error: {error}</div>
            ) : (
                <div className="h-6 text-xs"> </div>
            )}

            <button
                onClick={handleAdd}
                className="p-2 mr-3 flex items-center justify-center rounded-md border px-8 py-2 text-base font-medium text-white   bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <AddIcon className="mr-2" />
                Add Highlight
            </button>
        </div>
    );
};

export default HighlightsInput;
