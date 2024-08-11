import React from 'react';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { ICategory, ISubCategory } from '../../interfaces/Catalog/IMainCategory';
import { getLocalizedField } from '../../utils/localized/localized';

interface CategorySelectProps {
    categoryList: ICategory[];
    selectedCategory: ICategory | null;
    selectedSubCategory: ISubCategory | null;
    handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { category?: string };
    lang: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
    categoryList,
    selectedCategory,
    selectedSubCategory,
    handleCategoryChange,
    errors,
    lang
}) => {

    return (
        <FormControl fullWidth variant="outlined">
            <TextField
                id="CategoryId"
                name="CategoryId"
                select
                value={selectedCategory?.id ?? ''}
                onChange={handleCategoryChange}
                error={!!errors.category}
            >
                {categoryList
                    .filter(cat => !selectedSubCategory || selectedSubCategory?.id === cat.subCategoryId)
                    .map(category => (
                        <MenuItem key={category.id} value={category.id}>
                            {getLocalizedField(category, 'name', lang)}
                        </MenuItem>
                    ))}
            </TextField>
            {errors.category ? (
                <div className="h-6 text-xs text-red-500">Error: {errors.category}</div>
            ) : (<div className="h-6 text-xs "> </div>)}
        </FormControl>
    );
};

export default CategorySelect;
