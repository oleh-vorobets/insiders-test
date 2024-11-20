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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');

    const { forgot, loading } = useAuth();

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const credentials = { email };
        await forgot(credentials);
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
                    Forgot Password
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

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1 }}
                        disabled={loading}
                    >
                        Send mail
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

export default ForgotPasswordPage;
