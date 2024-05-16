import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { CurrentPageContext } from "../context/currentPage";

function NavMenu() {
  const { setCurrentPage } = useContext(CurrentPageContext)
  
  function handleClick(page){
    setCurrentPage(page)
  }

  return (
      <List>
        <ListItem disablePadding as={NavLink} to="/">
          <ListItemButton onClick={() => handleClick("Dashboard")}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem >
        <ListItem disablePadding as={NavLink} to="/alerts">
          <ListItemButton onClick={() => handleClick("Alerts")}>
            <ListItemText primary="Alerts" />
          </ListItemButton>
        </ListItem >
        <ListItem disablePadding as={NavLink} to="/health_metrics">
          <ListItemButton onClick={() => handleClick("Health Metrics")}>
            <ListItemText primary="Health Metrics" />
          </ListItemButton>
        </ListItem >
        <ListItem disablePadding as={NavLink} to="/prescriptions">
          <ListItemButton onClick={() => handleClick("Prescriptions")}>
            <ListItemText primary="Prescriptions" />
          </ListItemButton>
        </ListItem >
        <ListItem disablePadding as={NavLink} to="/medications">
          <ListItemButton onClick={() => handleClick("Medications")}>
            <ListItemText primary="Medication Search" />
          </ListItemButton>
        </ListItem>
      </List>
      
  );
}

export default NavMenu;
