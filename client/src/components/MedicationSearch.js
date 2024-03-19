import { Form, Checkbox } from "semantic-ui-react";

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
    <>
      <p style={{textAlign: "left", marginBottom: '0', marginLeft:'0.2rem', fontSize: '1rem'}}>{label}</p>
      <Form>
        <Form.Input

          type="text"
          name="search"
          value={searchFor}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Form.Group>
            <Form.Field>
              <Checkbox
                radio
                label="Generic Name"
                name="generic"
                value="generic"
                checked={searchBy === "generic"}
                onChange={(e, data) => onSearchBySelection(data.value)}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label="Brand Name"
                name="brand"
                value="brand"
                checked={searchBy === "brand"}
                onChange={(e, data) => onSearchBySelection(data.value)}
              />
            </Form.Field>
          </Form.Group>
        </div>
      </Form>
    </>
  );
}
export default MedicationSearch;
