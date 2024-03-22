import { useContext } from "react";
import Datetime from "react-datetime";
import moment from "moment";
import { Form } from "semantic-ui-react";
import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions"

function HealthMetricFilter({ filterMetric, onMetricChange, filterDate, onDateChange, filterPrescription, onPrescriptionChange }) {
  const { healthMetrics } = useContext(HealthMetricsContext);
  const { prescriptions } = useContext(PrescriptionsContext)

  const today = moment();
  const valid = function (current) {
    return current.isBefore(today);
  };

  const userMetricTypes = [
    ...new Set(
      healthMetrics.map((metric) => metric.metric_type.metric_type
      ))]
  userMetricTypes.unshift('All')
  const metricOptions = userMetricTypes.map((type) => (
    {key: type, value: type, text: type}
  ));
  
  const prescriptionOptions = prescriptions.map((script) => ({key: script.medication.generic_name, value: script.medication.generic_name, text: script.medication.generic_name}))
  prescriptionOptions.unshift({key: 'All', value: 'All', text: 'All'})
  
  return (
    <>
    <p style={{textAlign: "left", marginBottom: '0', marginLeft:'0.2rem', fontSize: '1rem'}}>Filter Health Metrics</p>
    <Form size='mini'>
      <Form.Group widths='equal'>
      <Form.Field>
      <Form.Select
        placeholder="Select Metric Type"
        options={metricOptions}
        value={filterMetric}
        onChange={(e, { value }) => { onMetricChange(value); onPrescriptionChange('') }}
      />
      </Form.Field>
      <Form.Field>
        <Datetime
          inputProps={{placeholder: 'Select Start Date'}}
          isValidDate={valid}
          timeFormat={false}
          value={filterDate}
          onChange={(e) => onDateChange(e)}
        />
      </Form.Field>
      {filterMetric === 'Medication Taken' && <Form.Field>
        <Form.Select 
          placeholder="Select Prescription"
          options={prescriptionOptions}
          value={filterPrescription}
          onChange={(e, { value }) => onPrescriptionChange(value)}
        />
      </Form.Field>}
      </Form.Group>
    </Form>
    </>
  );
}

export default HealthMetricFilter;
