import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

interface IMenuAppBar {
    children?: React.ReactNode;
    icon: React.ReactElement<any, any>;
    to: string;
}

const MenuAppBar: React.FC<IMenuAppBar> = ({ icon, to }) => {
    const handleClick = () => {
        navigate(to);
    };

    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Test task
                    </Typography>

                    <div>
                        <IconButton
                            size="large"
                            aria-label="gallery"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleClick}
                            color="inherit"
                        >
                            {icon}
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default MenuAppBar;
