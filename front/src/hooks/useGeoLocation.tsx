import { useEffect, useState } from 'react';

const useGeoLocation = () => {
    const [location, setLocation] = useState<GeolocationPosition | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            setLocation(position);
        });
    }, []);

    return location ? location.coords : null;
};

export default useGeoLocation;
