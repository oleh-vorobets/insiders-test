import { LockOutlined } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Container,
    FormControlLabel,
    Paper,
    TextField,
    Typography,
    Checkbox,
    Button,
    Grid2,
    Link,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { LoginError } from '../../../providers/AuthProvider/types';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const { login, loading, error, authenticated, refresh } = useAuth();

    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const credentials = { email, password };
        await login(credentials);
        console.log(error);
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
                    Sign In
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                value="remember"
                                color="primary"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                            />
                        }
                        label="Remember me"
                    ></FormControlLabel>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1 }}
                        disabled={loading}
                    >
                        Sign in
                    </Button>
                </Box>
                <Grid2 container justifyContent="space-between" sx={{ mt: 3 }}>
                    <Link component={RouterLink} to="/forgot">
                        Forgot password?
                    </Link>
                    <Link component={RouterLink} to="/signup">
                        Sign up
                    </Link>
                </Grid2>
            </Paper>
        </Container>
    );
};

export default LoginPage;
