import { FormControl, RadioGroup, Radio, TextField, FormControlLabel, Grid } from "@mui/material"; // Importing necessary Material-UI components

function MedicationSearch({
  onSearch,
  searchFor,
  onSearchBySelection,
  searchBy,
  prescriptions,
}) {
  let label;
  prescriptions
    ? (label = "Search your Prescriptions")
    : (label = "Search Medications");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} >
        <TextField
          fullWidth
          variant="standard"
          type="text"
          label={label}
          value={searchFor}
          onChange={(e) => onSearch(e.target.value)}
          sx={{ backgroundColor: 'white'}}
        />
      </Grid>
      <Grid item xs={12} >
        <FormControl component="fieldset">
          <RadioGroup row value={searchBy} onChange={(e) => onSearchBySelection(e.target.value)}>
            <FormControlLabel value="generic" control={<Radio />} label="Generic Name" />
            <FormControlLabel value="brand" control={<Radio />} label="Brand Name" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default MedicationSearch;
