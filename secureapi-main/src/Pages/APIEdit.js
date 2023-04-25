import { useState } from "react";

function selectedOption() {}

function handleOptionChange() {}

function APIEdit() {
    const [linkUrl, setLinkUrl] = useState('');


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
        <input type="text"/>

    <br/><br/>
    <button style={{ float: "right", marginRight: "20px" }}> {" "}Save{" "}</button>

</div>
);
}

export default APIEdit;
