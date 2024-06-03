export interface IBagUser{
    id: number;
    countProduct: number;
    orderDate: string;
    userEmail: string;
    userId: string;
}

export interface BagItems{
    id: number;
    productId: number;
    size: number;
    bagId: number;
    quantity: number;
    name: string;
    article: string;
    price: number;
    image: string;
}