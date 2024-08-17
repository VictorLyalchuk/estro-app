import React from 'react';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { IMainCategory, ISubCategory } from '../../interfaces/Category/Main-Category/IMainCategory';
import { getLocalizedField } from '../../utils/localized/localized';

interface SubCategorySelectProps {
    subCategory: ISubCategory[];
    selectedSubCategory: ISubCategory | null;
    selectedMainCategory: IMainCategory | null;
    handleSubCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { subCategory?: string };
    lang: string;
}

const SubCategorySelect: React.FC<SubCategorySelectProps> = ({
    subCategory,
    selectedSubCategory,
    selectedMainCategory,
    handleSubCategoryChange,
    errors,
    lang
}) => {
    return (
        <FormControl fullWidth variant="outlined">
            <TextField
                id="subCategoryId"
                name="subCategoryId"
                select
                value={selectedSubCategory?.id ?? ''}
                onChange={handleSubCategoryChange}
                error={!!errors.subCategory}
            >
                {subCategory
                    .filter(subCat => !selectedMainCategory || selectedMainCategory?.id === subCat.mainCategoryId)
                    .map(subCat => (
                        <MenuItem key={subCat.id} value={subCat.id}>
                            {getLocalizedField(subCat, 'name', lang)}
                        </MenuItem>
                    ))}
            </TextField>
            {errors.subCategory ? (
                <div className="h-6 text-xs text-red-500">Error: {errors.subCategory}</div>
            ) : (<div className="h-6 text-xs "> </div>)}
        </FormControl>
    );
};

export default SubCategorySelect;
