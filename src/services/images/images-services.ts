import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IIUserImageEdit } from "../../interfaces/Auth/IIUserImageEdit";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/AccountControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function beforeUpload(file: File) {
    try {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            // message.error('Оберіть файл зображення!');
        }
        const isLt2M = file.size / 1200 / 1200 < 10;
        if (!isLt2M) {
            // message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        console.log("is select", isImage && isLt2M);
        return isImage && isLt2M;

    } catch (error) {
        console.error('Failed to confirm user:', error);
        throw error;
    }
}

//1
export async function deleteUserImage(userImage: string ) {
    try {
        if (userImage != "") {
            await instance.post(`${baseUrl}/api/Image/DeleteUserImage`, { image: userImage }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        }
    } catch (error) {
        console.error('Failed to delete image user:', error);
        throw error;
    }
}

//2
export async function createUserImage(file: File) {
    try {
        const response = await instance.post(`${baseUrl}/api/Image/CreateUserImage`, { ImageFile: file }, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create image user:', error);
        throw error;
    }
}

//3
export async function editUserImage(userImageEdit: IIUserImageEdit ) {
    try {
        await instance.post(`${baseUrl}/api/AccountControllers/EditUserImage`, userImageEdit);
    } catch (error) {
        console.error('Failed to edit image user:', error);
        throw error;
    }
}
