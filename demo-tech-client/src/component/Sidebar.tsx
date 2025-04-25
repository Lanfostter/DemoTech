import React, {JSX} from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemButton,
    ListItemIcon,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Person } from '@mui/icons-material';
import { isAdmin } from "../helper/constant";

interface SidebarProps {
    open: boolean;
    toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
    const location = useLocation(); // Get the current path

    // Define menu items
    const menuItems: { label: string; icon: JSX.Element; path: string; show: boolean }[] = [
        { label: 'User', icon: <Person />, path: '/users', show: isAdmin() }, // Chỉ hiển thị khi isAdmin() = true
    ];

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={toggleDrawer}
            sx={{
                width: 250,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 250,
                    boxSizing: 'border-box',
                    backgroundColor: '#f5f5f5',
                    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                },
            }}
            ModalProps={{ disablePortal: true }}
        >
            <List>
                {menuItems
                    .filter(({ show }) => show) // Lọc ra các mục cần hiển thị
                    .map(({ label, icon, path }) => (
                        <ListItem key={path} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={path}
                                sx={{
                                    backgroundColor: location.pathname === path ? '#d0d0d0' : 'transparent',
                                    fontWeight: location.pathname === path ? 'bold' : 'normal',
                                    '&:hover': { backgroundColor: '#e0e0e0' },
                                }}
                                onClick={toggleDrawer} // Close sidebar on click
                            >
                                <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.12)' }} />
        </Drawer>
    );
};

export default Sidebar;
