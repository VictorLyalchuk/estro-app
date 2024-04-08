export interface IUserEdit {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    emailConfirmed: boolean,
    role: string,
    imagePath: string,
    phoneNumber: string,
    password: string,
    birthday: Date,
}