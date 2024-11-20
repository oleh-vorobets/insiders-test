import { LockOutlined } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Container,
    Paper,
    TextField,
    Typography,
    Button,
    Grid2,
    Link,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { LoginError } from '../../../providers/AuthProvider/types';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const { signup, loading, error, authenticated, refresh } = useAuth();

    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const credentials = { email, password, firstName, lastName };
        await signup(credentials);
        if (error === LoginError.NONE) navigate('/');
    }
    useEffect(() => {
        const attempLogin = async () => {
            setIsRefreshing(true);
            await refresh();
            setIsRefreshing(false);
            if (authenticated) {
                navigate('/');
            }
        };

        attempLogin();
    }, [authenticated, refresh, navigate]);

    if (isRefreshing) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <Typography variant="h6">
                    Refreshing authentication...
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xs">
            <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
                <Avatar
                    sx={{
                        mx: 'auto',
                        bgcolor: 'secondary.main',
                        textAlign: 'center',
                        mb: 1,
                    }}
                >
                    <LockOutlined></LockOutlined>
                </Avatar>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{ textAlign: 'center' }}
                >
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        placeholder="Your name"
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb: 2 }}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    ></TextField>
                    <TextField
                        placeholder="Your surname"
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb: 2 }}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    ></TextField>
                    <TextField
                        placeholder="Email"
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb: 2 }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></TextField>
                    <TextField
                        placeholder="Password"
                        fullWidth
                        required
                        type="password"
                        sx={{ mb: 2 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1 }}
                        disabled={loading}
                    >
                        Sign up
                    </Button>
                </Box>
                <Grid2 container justifyContent="space-around" sx={{ mt: 3 }}>
                    <Link component={RouterLink} to="/login">
                        I already have an account
                    </Link>
                </Grid2>
            </Paper>
        </Container>
    );
};

export default SignupPage;
