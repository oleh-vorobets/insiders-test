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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { LoginError } from '../../../providers/AuthProvider/types';

const ResetPasswordPage: React.FC = () => {
    const [token, setToken] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const { reset, error, loading } = useAuth();

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromQuery = urlParams.get('token');
        if (tokenFromQuery) {
            setToken(tokenFromQuery);
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirmPassword) return;

        const payload = { token, newPassword: password };
        await reset(payload);
        if (error === LoginError.NONE) navigate('/');
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
                    Reset Password
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        placeholder="Password"
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb: 2 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    ></TextField>
                    <TextField
                        placeholder="Confirm password"
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb: 2 }}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                    ></TextField>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1 }}
                        disabled={loading}
                    >
                        Reset password
                    </Button>
                </Box>
            </Paper>
            <Grid2
                container
                sx={{ mt: 3, position: 'absolute', top: 4, left: 24 }}
            >
                <Link
                    component="button"
                    onClick={handleGoBack}
                    sx={{ fontSize: 24 }}
                >
                    &larr; Go back
                </Link>
            </Grid2>
        </Container>
    );
};

export default ResetPasswordPage;
