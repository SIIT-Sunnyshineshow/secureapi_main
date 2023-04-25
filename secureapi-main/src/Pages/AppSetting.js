import { useState } from "react";

function selectedOption() {}

function handleOptionChange() {}

function AppSetting() {
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
        App Setting
    </h1> 
    <h3 style={{textAlign: "left", marginLeft: "20px"}}>Attributes <br/></h3>
    <div><input type="text"/></div>

    <h3 style={{textAlign: "left", marginLeft: "20px"}}>Login Page <br/></h3>
    <div><input type="text"/> </div>

    <h3 style={{textAlign: "left", marginLeft: "20px"}}>
        Callback Login API <br/>
    </h3>
    <input type="text"/>

    <h3 style={{textAlign: "left", marginLeft: "20px"}}>
        API Secret Key <br/>
    </h3>
    <input type="text"/> <button> {" "} Generate Key {" "}</button>
    
    <h3 style={{textAlign: "left", marginLeft: "20px"}}>
        API Channel Access <br/>
    </h3>
    <input type="text"/>

    <h3 style={{textAlign: "left", marginLeft: "20px"}}>
        App ID <br/>
    </h3>
    <input type="text"/>

    <br/><br/>
    <button style={{ float: "right", marginRight: "20px" }}> {" "}Save{" "}</button>

</div>
);
}

export default AppSetting;
