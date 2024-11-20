import { useEffect, useState } from 'react';
import useGeoLocation from '../../../hooks/useGeoLocation';
import { weatherService } from '../../../services/weather/WeatherService';
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid2,
    Typography,
    Link,
} from '@mui/material';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MenuAppBar from '../../../components/UI/AppBar';
import CollectionsIcon from '@mui/icons-material/Collections';

const WeatherPage: React.FC = () => {
    const [weather, setWeather] = useState<any>(null);

    const location = useGeoLocation();
    const navigate = useNavigate();

    const { logout } = useAuth();

    useEffect(() => {
        const fetchWeather = async () => {
            if (location) {
                try {
                    const weatherData = await weatherService.getWeather(
                        location.longitude,
                        location.latitude
                    );
                    setWeather(weatherData.data);
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                } finally {
                }
            }
        };

        fetchWeather();
    }, [location]);

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    if (!weather) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <MenuAppBar icon={<CollectionsIcon />} to="/gallery" />
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    marginTop: 5,
                    backgroundColor: '#f4f4f4',
                    borderRadius: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Weather in {weather.name}
                </Typography>
                <Card
                    sx={{
                        width: 350,
                        textAlign: 'center',
                        padding: 2,
                        marginTop: 3,
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {weather.weather[0].description.toUpperCase()}
                        </Typography>
                        <Typography variant="body1">
                            🌡️ Temperature: {weather.main.temp}°C
                        </Typography>
                        <Typography variant="body1">
                            🌀 Feels like: {weather.main.feels_like}°C
                        </Typography>
                        <Typography variant="body1">
                            🌬️ Wind: {weather.wind.speed} m/s
                        </Typography>
                        <Typography variant="body1">
                            💧 Humidity: {weather.main.humidity}%
                        </Typography>
                        <Typography variant="body1">
                            📍 Coordinates: {weather.coord.lat},{' '}
                            {weather.coord.lon}
                        </Typography>
                    </CardContent>
                </Card>
                <Grid2
                    container
                    sx={{ mt: 3, position: 'absolute', top: 4, left: 24 }}
                >
                    <Link
                        component="button"
                        onClick={handleLogout}
                        sx={{ fontSize: 24 }}
                    >
                        Logout
                    </Link>
                </Grid2>
            </Container>
        </>
    );
};

export default WeatherPage;
