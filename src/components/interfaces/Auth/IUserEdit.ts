export interface IUserEdit {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    emailconfirmed: boolean,
    role: string,
    imagePath: string,
    phoneNumber: string,
    password: string,
    birthday: Date,
}