import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Fab,
    Grid2,
    ImageList,
    ImageListItem,
    Modal,
    Typography,
} from '@mui/material';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import MenuAppBar from '../../../components/UI/AppBar';
import CloudIcon from '@mui/icons-material/Cloud';
import AddIcon from '@mui/icons-material/Add';
import { galleryService } from '../../../services/gallery/GalleryService';

const GalleryPage: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { loading } = useAuth();

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            const imagesData = await galleryService.getImages();
            setImages(imagesData.data.images);
            setIsLoading(false);
        };
        fetchImages();
    }, []);

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        console.log(event.dataTransfer.files);
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) setSelectedFile(file);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        const uploadImage = async () => {
            const imagesData = await galleryService.uploadImages(selectedFile);
            setImages((images: any) => [...images, imagesData.data.url]);
            setOpenModal(false);
        };

        uploadImage();
    };

    const handleFileChange = (file: File | null) => {
        if (file) {
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
            } else {
                alert('Please select a valid image file');
            }
        }
    };

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    if (isLoading) {
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
            <MenuAppBar icon={<CloudIcon />} to="/" />
            <ImageList sx={{ width: '100%', height: 'auto' }} cols={3} gap={8}>
                {images.map((item, index) => (
                    <ImageListItem key={index}>
                        <img src={item} alt="Photo" loading="lazy" />
                    </ImageListItem>
                ))}
            </ImageList>
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleOpen}
            >
                <AddIcon />
            </Fab>

            <Modal open={openModal} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: 24,
                        width: 400,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Drag & Drop a Photo or Click to Upload
                    </Typography>

                    <Box
                        sx={{
                            border: '2px dashed #ccc',
                            padding: 2,
                            marginBottom: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <Typography variant="body2" color="textSecondary">
                            Drop file here or click the button to select
                        </Typography>
                    </Box>

                    <Grid2
                        container
                        justifyContent="space-between"
                        sx={{ mt: 3 }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="file-input"
                            onChange={(e) =>
                                handleFileChange(e.target.files?.[0] || null)
                            }
                        />

                        <label htmlFor="file-input">
                            <Button
                                variant="contained"
                                component="span"
                                sx={{ mb: 2 }}
                            >
                                Choose File
                            </Button>
                        </label>

                        {selectedFile && (
                            <Box sx={{ marginBottom: 2 }}>
                                <Typography variant="body2">
                                    {selectedFile.name}
                                </Typography>
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Uploaded image"
                                    style={{ maxWidth: '100%', marginTop: 10 }}
                                />
                            </Box>
                        )}
                    </Grid2>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile || loading}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default GalleryPage;
