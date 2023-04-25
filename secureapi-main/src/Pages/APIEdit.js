import { useState } from "react";

function selectedOption() {}

function handleOptionChange() {}

function APIEdit() {
    const [linkUrl, setLinkUrl] = useState('');

    function DropdownButton() {
      const [selectedOption, setSelectedOption] = useState("");
    
      const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
      };
    }

return (
<div>
    <h1 style={{ textAlign: "right", marginRight: "10px" }}>
        Posting API
    </h1>
    <h3 style={{textAlign: "left", marginLeft: "20px"}}>
        API Gateway <br/>
    </h3>
    <div>
    <input 
          type="text"
          value={linkUrl}
          onChange={(event) => setLinkUrl(event.target.value)}
        />
        {linkUrl.startsWith('http') && (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            Click here to view link
          </a>
        )}
    </div>
    <h3 style={{textAlign: "left", marginLeft: "20px"}}>
        Allowed Attributes <br/>
    </h3>
    <input type="text"/>
    


    <h3 style={{textAlign: "left", marginLeft: "20px"}}>
        Method </h3>
        <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    
    </div>

    <br/><br/>
    <button style={{ float: "right", marginRight: "20px" }}> {" "}Save{" "}</button>

</div>
);
}

export default APIEdit;
