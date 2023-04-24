import { useState } from "react";




function APIEdit() {
    const [linkUrl, setLinkUrl] = useState('');

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

</div>
}

export default APIEdit;
