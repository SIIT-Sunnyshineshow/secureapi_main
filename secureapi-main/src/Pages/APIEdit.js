import { useState, useEffect } from "react";
import axios from "axios";

function selectedOption() {}

function handleOptionChange() {}

function APIEdit() {
  const [linkUrl, setLinkUrl] = useState("");

  const [apiData, setApiData] = useState({});
  const [attribText, setAttribText] = useState("");

  function DropdownButton() {
    const [selectedOption, setSelectedOption] = useState("");

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };
  }

  useEffect(() => {
    let headers = {
      accesstoken: localStorage.getItem("accesstoken"),
      refreshtoken: localStorage.getItem("refreshtoken"),
      sessionid: localStorage.getItem("sessionid"),
    };

    axios
      .post(
        "http://localhost:8080/api/app/getoneapi",
        { _id: new URLSearchParams(window.location.search).get("api_id") },
        { headers: headers }
      )
      .then((response) => {
        let data = response.data.data[0];
        setApiData(data);
        let outstr = "";
        for (let element of data.allowedAttributes) {
          outstr += element + ";";
        }

        setAttribText(outstr);

        //console.log(data);
      })
      .catch((error) => {
        alert("Error while loading API");
        console.log(error);
      });
  });

  return (
    <div>
      <h1 style={{ textAlign: "right", marginRight: "10px" }}>Posting API</h1>
      <label style={{ textAlign: "left", marginLeft: "20px" }}>
        API Gateway:
      </label>
      <input
        type="text"
        value={
          "https://secureapi-main-api-2277.azurewebsites.net/api/oauth/oapi/get/" +
          apiData.apiLink
        }
        style={{ width: "80%" }}
        disabled
      />
      <br />
      <label style={{ textAlign: "left", marginLeft: "20px" }}>API Link:</label>
      <input
        type="text"
        value={apiData.apiPriLink}
        style={{ width: "80%" }}
        disabled
      />
      <br />
      <label style={{ textAlign: "left", marginLeft: "20px" }}>
        Allowed Attributes:
      </label>
      <input type="text" style={{ width: "80%" }} value={attribText} disabled />{" "}
      <br />
      <label style={{ textAlign: "left", marginLeft: "20px" }}>App ID:</label>
      <input
        type="text"
        style={{ width: "80%" }}
        value={apiData.app_id}
        disabled
      />{" "}
      <br />
      <div>
        <label style={{ textAlign: "left", marginLeft: "20px" }}>
          Method:{" "}
        </label>
        <select value="GET" onChange={handleOptionChange} disabled>
          <option value="">Select an option</option>
          <option value="GET">GET</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <br />
        <button
          onClick={() =>
            window.location.replace("/api_list?app_id=" + apiData.app_id)
          }
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default APIEdit;
