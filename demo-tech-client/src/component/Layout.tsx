import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import * as React from "react";

const Layout: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100svh",
            }}
        >
            <Header toggleDrawer={toggleDrawer} />
            <Sidebar open={drawerOpen} toggleDrawer={toggleDrawer} />
            <Box>
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
};

export default Layout;
