import { useContext } from "react";

import { HealthMetricsContext } from "../context/healthMetrics";
import { Form, FormGroup } from "semantic-ui-react";

function HealthMetricFilter({ filterMetric, onChangeFilter }) {
  const { healthMetrics } = useContext(HealthMetricsContext);

  const userMetricTypes = [
    ...new Set(
      healthMetrics.map((metric) =>
        JSON.stringify({
          id: metric.metric_type_id,
          type: metric.metric_type.metric_type,
        })
      )
    ),
  ].map(JSON.parse);

  const radioDisplayLineOne = userMetricTypes.slice(0, 5).map((type) => (
    <Form.Radio
      label={type.type}
      value={type.type}
      checked={filterMetric === type.type}
      onChange={(e, { value }) => onChangeFilter(value)}
      key = {type.id}
    />
  ));

  const radioDisplayLineTwo = userMetricTypes.slice(-4).map((type) => (
    <Form.Radio
      label={type.type}
      value={type.type}
      checked={filterMetric === type.type}
      onChange={(e, { value }) => onChangeFilter(value)}
      key = {type.id}
    />
  ));
  
  return (
    <Form size='mini'>
      <Form.Group>
        <Form.Radio
          label='All'
          value='All'
          checked={filterMetric === 'All'}
          onChange={(e, { value }) => onChangeFilter(value)}
        />
        {radioDisplayLineOne}
      </Form.Group>
      <FormGroup>
        {radioDisplayLineTwo}
      </FormGroup>
    </Form>
  );
}

export default HealthMetricFilter;
