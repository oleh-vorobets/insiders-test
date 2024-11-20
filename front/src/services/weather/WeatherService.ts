import { authAxios, hostname } from '../../providers/AxiosProvider';

export const weatherService = {
    async getWeather(lon: number, lat: number) {
        try {
            const data = await authAxios.post(hostname + '/weather/', {
                lon,
                lat,
            });

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
