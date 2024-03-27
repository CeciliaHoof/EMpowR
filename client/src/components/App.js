import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Typography,
  Box,
  Toolbar,
  IconButton,
  Drawer,
  CssBaseline,
  Divider,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MuiAppBar from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled, useTheme } from "@mui/material/styles";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import Medications from "../pages/Medications";
import Prescriptions from "../pages/Prescriptions";
import HealthMetrics from "../pages/HealthMetrics";
import ManageAccount from "../pages/ManageAccount";
import NavMenu from "./NavMenu";
import MedicationDetails from "./MedicationDetails";
import PrescriptionDetails from "./PrescriptionDetails";

import { UserContext } from "../context/user";
import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";
import { MedicationsContext } from "../context/medications";
import { CurrentPageContext } from "../context/currentPage";


const drawerWidth = 240;

function App() {
  const { user, setUser } = useContext(UserContext);
  const { setHealthMetrics } = useContext(HealthMetricsContext);
  const { setPrescriptions } = useContext(PrescriptionsContext);
  const { setMedications } = useContext(MedicationsContext);
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = useTheme();
  const navigate = useNavigate();

  console.log(theme);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((data) => {
          setUser(data);
          setHealthMetrics(data.health_metrics);
          setPrescriptions(data.prescriptions);
        });
      } else {
        setUser(null);
      }
    });
    fetch("/medications")
      .then((r) => r.json())
      .then((data) => setMedications(data));
  }, [setHealthMetrics, setPrescriptions, setMedications, setUser]);

  if (!user) {
    return <Login />;
  }

  function handleDrawer(bool) {
    setOpen(bool);
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    fetch("/logout", {
      method: "DELETE",
    });
    setUser(null);
  }

  function handleSnackbarClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarMessage("");
    setOpenSnackBar(false);
  }

  function handleSnackbar(string) {
    setSnackbarMessage(string);
    setOpenSnackBar(true);
  }

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
                onClick={() => handleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" component="div" noWrap>
                EMpowR /
              </Typography>
              <Typography
                variant="h5"
                component="div"
                noWrap
                sx={{ marginLeft: "0.5rem" }}
              >
                {currentPage}
              </Typography>
              <div style={{ flexGrow: 1 }} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h6">{`Welcome, ${user.first_name}`}</Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => {handleClose(); navigate('/manage_account'); setCurrentPage("Manage Account")}}>My account</MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>

          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={() => handleDrawer(false)}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <NavMenu />
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/medications" element={<Medications />} />
              <Route
                path="/prescriptions"
                element={<Prescriptions setSnackbar={handleSnackbar} />}
              />
              <Route
                path="/health_metrics"
                element={<HealthMetrics setSnackbar={handleSnackbar} />}
              />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/medications/:id" element={<MedicationDetails />} />
              <Route
                path="/prescriptions/:id"
                element={<PrescriptionDetails setSnackbar={handleSnackbar} />}
              />
              <Route path="/manage_account" element={<ManageAccount />} />
            </Routes>
          </Main>
        </Box>
        <Snackbar
          open={openSnackBar}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          action={action}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </LocalizationProvider>
    </>
  );
}

export default App;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));