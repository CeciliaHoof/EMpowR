import React, { useContext } from "react";
import { FormControl, InputLabel, MenuItem, Select, Typography, Box, Grid } from "@mui/material";
import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Container } from "@mui/system";

function HealthMetricFilter({ filterMetric, onMetricChange, filterDate, onDateChange, filterPrescription, onPrescriptionChange }) {
  const { healthMetrics } = useContext(HealthMetricsContext);
  const { prescriptions } = useContext(PrescriptionsContext);

  const userMetricTypes = [
    ...new Set(
      healthMetrics.map((metric) => metric.metric_type.metric_type)
    )
  ];
  userMetricTypes.unshift('All');
  const metricOptions = userMetricTypes.map((type) => (
    <MenuItem key={type} value={type}>{type}</MenuItem>
  ));

  const prescriptionOptions = prescriptions.map((script) => (
    <MenuItem key={script.medication.generic_name} value={script.medication.generic_name}>
      {script.medication.generic_name}
    </MenuItem>
  ));
  prescriptionOptions.unshift(<MenuItem key="All" value="All">All</MenuItem>);

  return (
    <>
    <Typography variant="body1" style={{ textAlign: "left", marginBottom: '0', marginLeft:'0.2rem', fontSize: '1rem'}}>
        Filter Health Metrics
      </Typography>
    <Container sx={{padding:'0.5rem', backgroundColor: 'white' }}>
    
    <Grid container spacing={2} justifyContent={"center"}>
      <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ mt: 1}}>
        <FormControl fullWidth >
          <InputLabel id="metric-type-label">Select Metric Type</InputLabel>
          <Select
            labelId="metric-type-label"
            label="Select Metric Type"
            value={filterMetric}
            onChange={(e) => { onMetricChange(e.target.value); onPrescriptionChange('') }}
          >
            {metricOptions}
          </Select>
        </FormControl>
      </Box>
      </Grid>
      {filterMetric === 'Medication Taken' && (
        <Grid item xs={12} sm={6} md={4}>
        <Box sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="prescription-label">Select Prescription</InputLabel>
            <Select
              labelId="prescription-label"
              label="Select Prescription"
              value={filterPrescription}
              onChange={(e) => onPrescriptionChange(e.target.value)}
            >
              {prescriptionOptions}
            </Select>
          </FormControl>
        </Box>
        </Grid>
      )}
      <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ mt: 1 }}>
      <FormControl fullWidth >
        
      <DatePicker
              label="Select Start Date"
              inputFormat="MM/dd/yyyy"
              value={filterDate}
              onChange={onDateChange}
              textField={(params) => <input {...params} placeholder="Select Start Date" />}
              disableFuture
            />
        </FormControl>
      </Box>
      </Grid>
      
      </Grid>
    </Container>
    </>
  );
}

export default HealthMetricFilter;
