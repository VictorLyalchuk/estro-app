import React from 'react';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { getLocalizedField } from '../../utils/localized/localized';
import { ICategory, IMainCategory, ISubCategory } from '../../interfaces/Catalog/IMainCategory';


interface CategorySelectProps {
    categoryList: ICategory[];
    selectedCategory: ICategory | null;
    selectedSubCategory: ISubCategory | null;
    selectedMainCategory: IMainCategory | null;
    handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { category?: string };
    lang: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
    categoryList,
    selectedCategory,
    selectedSubCategory,
    selectedMainCategory,
    handleCategoryChange,
    errors,
    lang
}) => {

    const filteredCategories = categoryList.filter(cat => {
        if (selectedSubCategory) {
            return cat.subCategoryId === selectedSubCategory.id;
        }
        if (selectedMainCategory) {
            return cat.mainCategoryId === selectedMainCategory.id;
        }
        return true;
    });

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
                {filteredCategories.map(category => (
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
