import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1b1b1b',
                color: '#f5f5f0',
                textAlign: 'center',
                p: 3
            }}
        >
            <Typography variant="h3" gutterBottom>
                ❓ Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Kevlar f**t pictures not found!
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                🏠 Go Home
            </Button>
        </Box>
    )
}

export default NotFound
