import { authAxios, hostname } from '../../providers/AxiosProvider';
import { GetImagesResponse, UploadResponse } from './types';

export const galleryService = {
    async getImages() {
        try {
            const data = await authAxios.get<GetImagesResponse>(
                hostname + '/gallery/'
            );

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async uploadImages(file: File) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const data = await authAxios.post<UploadResponse>(
                hostname + '/gallery/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
