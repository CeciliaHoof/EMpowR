import { Form, Checkbox } from "semantic-ui-react";

function MedicationSearch({ onSearch, searchFor, onSearchBySelection, searchBy }) {
  return (
    <Form>
      <Form.Group inline>
        <Form.Field>
          <Checkbox
            radio
            label="Generic Names"
            name="generic"
            value="generic"
            checked={searchBy === "generic"}
            onChange={(e, data) => onSearchBySelection(data.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Brand Names"
            name="brand"
            value="brand"
            checked={searchBy === "brand"}
            onChange={(e, data) => onSearchBySelection(data.value)}
          />
        </Form.Field>
        <Form.Input 
            type='text'
            name='search'
            value={searchFor}
            onChange={(e) => onSearch(e.target.value)}
        />
      </Form.Group>
    </Form>
  );
}
export default MedicationSearch;
