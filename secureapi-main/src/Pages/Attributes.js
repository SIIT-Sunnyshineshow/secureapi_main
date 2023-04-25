import { useState } from "react";



function Attributes() {
    const [linkUrl, setLinkUrl] = useState('');

function MyButton() {
    const handleClick = () => {
      console.log("Button clicked!");
    };
      
        return <button onClick={handleClick}>Click me</button>;
}

return (
<div>
    <h1 style={{ textAlign: "right", marginRight: "10px" }}>
        Attribute
    </h1>

    
    <button>User</button>
    &nbsp;
    <button>SpeedBird</button>
    &nbsp;
    <button>Admin</button>
    &nbsp;
    <button>Profile</button>
    &nbsp;
    <button>Posting</button><br/>
    <br/>
    <button onClick={() => (window.location.href = "/signup")}> 
          {" "}
          Generate Key{" "}
        </button>

</div>
);
}

export default Attributes;
