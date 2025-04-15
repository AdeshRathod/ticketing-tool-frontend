import { Avatar, Box, Stack } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import { Outlet } from "react-router-dom";
import { DrawerProvider } from "./Drawer";
import useGetUser from "../../../hooks/Token/useUser";
import axios from "axios";
import { useQuery } from "react-query";
import Cookies from "js-cookie"; // Import Cookies for managing cookies

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Header() {
  return (
    <DrawerProvider>
      <Box sx={{ display: "flex" }}>
        <HeaderContent />
      </Box>
    </DrawerProvider>
  );
}

function HeaderContent() {
  const { authToken } = useGetUser();

  const { data } = useQuery(
    "emp-profile",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/populate/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.emp;
    },
    {
      onSuccess: () => {},
    }
  );

  const handleSignOut = () => {
    return new Promise((resolve) => {
      Cookies.remove("aegis"); // Remove authentication token
      Cookies.remove("role"); // Remove role information
      resolve();
    }).then(() => {
      window.location.reload(); // Reload the page to reset the app state
    });
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#2156A3", boxShadow: "none" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <h1 style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>
            Ticketing tool
          </h1>

          <Stack direction="row" spacing={2} alignItems="center">
            <button
              onClick={handleSignOut} // Attach the logout functionality
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid white",
                padding: "4px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Log out
            </button>
            <Avatar
              alt="profile"
              src={data?.user_logo_url} // Update with actual image
              sx={{ width: 32, height: 32 }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          bgcolor: "#F9FAFC",
          pt: "64px", // give enough top space for the AppBar
          px: "2%",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
