import React from 'react';
import { Box, IconButton } from '@mui/material';
import CreateBusinessProfile from '../Form/CreateBusinessProfile';
import CloseIcon from '@mui/icons-material/Close'; 

function CreateBusinessProfileDialog({ open, onClose, hasInvestorProfile }) {
    return (
        open && (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1300,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        background: '#F2F2F2',
                        maxWidth: '100%', 
                        maxHeight: '90%', 
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                        position: 'relative',
                        borderRadius: '8px'
                    }}>
                    <Box
                        sx={{
                            pt: 1,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}>
                        <IconButton onClick={onClose}
                            sx={{
                                color: '#ED262A', 
                            }}>
                            <CloseIcon sx={{ fontSize: '24px' }} /> 
                        </IconButton>
                    </Box>

                    {/* Form content */}
                    <Box sx={{ pb: 5, overflowY: 'auto'}}>
                        <CreateBusinessProfile onSuccess={onClose} />
                    </Box>
                </Box>
            </Box>
        )
    );
}

export default CreateBusinessProfileDialog;
