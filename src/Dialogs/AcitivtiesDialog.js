import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ActivitiesDialog = ({ open, onClose, activities }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Recent Activities
                <IconButton  edge="end" color="inherit" onClick={onClose} aria-label="close"
                    sx={{ position: 'absolute', right: 12, top: 10, color: '#ED262A'}}><CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <List>
                    {activities.map((activity, index) => {
                        const formattedTimestamp = new Date(activity.timestamp).toLocaleString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                        });
                        return (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={activity.action}
                                    secondary={
                                        <Box>
                                            <Typography variant="body2">{activity.details}</Typography>
                                            <Typography variant="caption" color="textSecondary">{formattedTimestamp}</Typography>
                                        </Box>
                                    }/>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default ActivitiesDialog;
