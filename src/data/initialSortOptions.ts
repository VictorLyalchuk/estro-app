import { ISortOption } from "../interfaces/Info/ISortOption";

export const initialSortOptions: ISortOption[] = [
    { name: 'Newest', url: 'newest', current: false },
    { name: 'Most Popular', url: 'most_popular', current: false },
    { name: 'Best Rating', url: 'best_rating', current: false },
    { name: 'Price: Low to High', url: 'price_low_to_high', current: false },
    { name: 'Price: High to Low', url: 'price_high_to_low', current: false },
];