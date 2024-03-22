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
    <Form size='mini'>
      <Form.Group widths='equal'>
      <Form.Field>
        <label>Select Metric Type</label>
      <Form.Select
        options={metricOptions}
        value={filterMetric}
        onChange={(e, { value }) => onMetricChange(value)}
      />
      </Form.Field>
      
      <Form.Field>
        <label>Select Start Date</label>
        <Datetime
          isValidDate={valid}
          timeFormat={false}
          value={filterDate}
          onChange={(e) => onDateChange(e)}
        />
      </Form.Field>
      </Form.Group>
      {filterMetric === 'Medication Taken' && <Form.Field>
        <label>Select Prescription</label>
        <Form.Select 
          options={prescriptionOptions}
          value={filterPrescription}
          onChange={(e, { value }) => onPrescriptionChange(value)}

        />
      </Form.Field>}
    </Form>
  );
}

export default HealthMetricFilter;
