import { Form, FormControl, Button } from 'react-bootstrap';

const SearchBar = () => {
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <Form className="d-flex flex-column flex-sm-row align-items-center">
      <FormControl
        type="text"
        placeholder="Search"
        className="mr-sm-2 mb-2 mb-sm-0"
        style={{ maxWidth: "100%" }}
        onClick={stopPropagation}
      />
      <Button className="ml-sm-2">
        <i className="bi bi-search"></i>
      </Button>
    </Form>
  );
};

export default SearchBar;
