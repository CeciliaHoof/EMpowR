import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Divider, Typography } from '@mui/material'
import { useTheme } from "@mui/material/styles";
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { CurrentPageContext } from "../context/currentPage"

function Snapshot({ num, type }) {
  const { setCurrentPage } = useContext(CurrentPageContext)
  const navigate = useNavigate()
  const theme = useTheme()

  function handleClick(){
    type === 'Prescriptions'
      ? navigate(`/prescriptions`) 
      : navigate(`/health_metrics`)
    setCurrentPage(type)
  }
  return (
    <Card sx={{ margin: '0.5rem'}}>
      <CardContent style={{ textAlign: 'center' }}>
        {type === 'Prescriptions' ?
          <LocalPharmacyIcon fontSize="large" sx={{ color: theme.palette.primary.light }}/>:
          <MonitorHeartIcon fontSize="large" sx={{ color: theme.palette.primary.light }}/>  
        }
        <Typography variant="h5" component="div">{`You have ${num} ${type.toLowerCase()} saved!`}</Typography>
      <Divider sx={{ marginBottom: '0.3rem'}}/>
        <Typography variant="body2" onClick={handleClick} style={{ cursor: 'pointer' }}>
          {`View ${type}`}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Snapshot;
