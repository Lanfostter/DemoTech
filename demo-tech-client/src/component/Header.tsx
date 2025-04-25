import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Logout, Password } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import {getUserName} from "../helper/constant.ts";

const StyledAppBar = styled(AppBar)({
    backgroundColor: "#1e1e1e",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
});

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    padding: "0 16px",
});

// Định nghĩa kiểu props cho Header
interface HeaderProps {
    toggleDrawer: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleDrawer }) => {
    const navigate = useNavigate();

    // State để quản lý menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        navigate("/login");
        handleCloseMenu();
    };

    const handleChangePassword = () => {

    };

    return (
        <StyledAppBar position="sticky">
            <StyledToolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                    <MenuIcon sx={{ fontSize: "2rem" }} />
                </IconButton>
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                    }}
                >
                    Simulation Process and Data Management
                </Typography>
                <Box
                    className="cursor-pointer"
                    display="flex"
                    alignItems="center"
                    onClick={handleMenuClick}
                    sx={{ "&:hover": { opacity: 0.8 } }}
                >
                    <Avatar sx={{ backgroundColor: "#4caf50", width: 40, height: 40 }}>
                        <AccountCircleIcon sx={{ fontSize: "2rem" }} />
                    </Avatar>
                    <Typography variant="body1" color="inherit" sx={{ marginLeft: 1, fontWeight: "500" }}>
                        {getUserName()}
                    </Typography>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        style: {
                            marginTop: "8px",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                    }}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                mt: 1.5,
                                "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                "&::before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) rotate(45deg)",
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <MenuItem
                        onClick={handleChangePassword}
                        sx={{ padding: "12px 24px", fontSize: "1rem", fontWeight: "500", gap: "10px" }}
                    >
                        <Password /> Change password
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={handleLogout}
                        sx={{ padding: "12px 24px", fontSize: "1rem", fontWeight: "500", gap: "10px" }}
                    >
                        <Logout /> Logout
                    </MenuItem>
                </Menu>
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default Header;
