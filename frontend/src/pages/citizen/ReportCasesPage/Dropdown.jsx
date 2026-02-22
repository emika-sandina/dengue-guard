import Select from "react-select";
import mohAreas from "./mohAreas.json";

function Dropdown({ value, onChange }) {


  return (
    <>

      <Select
        options={mohAreas}
        value={value}
        onChange={onChange}
        placeholder="Search MOH Area..."
        isSearchable
        isClearable
      />
    </>
  );
}



export default Dropdown;