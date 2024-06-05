import { IUserProfile } from "../../../Auth/IUserProfile";

export interface ProfileUserProps {
    userProfile?: IUserProfile;
    countPage: number;
}

export interface SettingsUserProps {
    userProfile?: IUserProfile;
}

export interface CompactOrdersProps {
    orders: IOrderUser[];
    onViewModeChange: () => void;
    page: number;
    countPage: number;
    onPageChange: (newPage: number) => void;
}

export interface OrdersProps {
    orders: IOrderUser[];
    onViewModeChange: () => void;
    page: number;
    countPage: number;
    onPageChange: (newPage: number) => void;
}