import { useState } from "react";
import axios from "axios";

function AppSetting() {
  const [attribText, setAttribText] = useState("");
  const [appData, setAppData] = useState({});

  const [secret, setSecret] = useState("");
  const [channelAccess, setChannelAccess] = useState("");

  const [secretAttrib, setSecretAttrib] = useState("");

  const handleSecretAttrib = (e) => {
    setSecretAttrib(e.target.value);
  };

  function DropdownButton() {
    const [selectedOption, setSelectedOption] = useState("");

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };
  }

  const handleAttribChange = (e) => setAttribText(e.target.value);

  const generateSecret = () => {
    let attributes = [];

    if (secretAttrib) {
      attributes = secretAttrib.split(";");
    } else {
      alert("Please specify attribute");
      return;
    }

    let sendingData = {
      app_id: appData._id,
      attributes,
    };

    let headers = {
      accesstoken: localStorage.getItem("accesstoken"),
      refreshtoken: localStorage.getItem("refreshtoken"),
      sessionid: localStorage.getItem("sessionid"),
    };

    console.log(sendingData);
    axios
      .post("http://localhost:8080/api/secret/generate", sendingData, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.code == 200) {
          setSecret(response.data.data);
          setChannelAccess(response.data.iv);
        } else {
          throw new Error("Error in response: " + response.data.code);
        }
      })
      .catch((error) => {
        alert("Error while loading API");
        console.log(error);
      });
  };

  const updateApp = () => {
    let headers = {
      accesstoken: localStorage.getItem("accesstoken"),
      refreshtoken: localStorage.getItem("refreshtoken"),
      sessionid: localStorage.getItem("sessionid"),
    };

    let attributes = [];

    if (attribText) {
      attributes = attribText.split(";");
    }
    let sendingData = {
      app_id: appData._id,
      user_id: localStorage.getItem("userid"),
      attributes,
    };
    axios
      .post("http://localhost:8080/api/app/updateapp", sendingData, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.code == 200) {
          alert("Update Successful");
        } else {
          throw new Error("response error");
        }
      })
      .catch((error) => {
        alert("An error has occured, please try again");
        console.log(error);
      });
  };

  function loadData() {
    if (Object.keys(appData).length != 0) {
      return;
    }
    console.log("Still Running");
    let headers = {
      accesstoken: localStorage.getItem("accesstoken"),
      refreshtoken: localStorage.getItem("refreshtoken"),
      sessionid: localStorage.getItem("sessionid"),
    };

    axios
      .post(
        "http://localhost:8080/api/app/getoneapp",
        { _id: new URLSearchParams(window.location.search).get("app_id") },
        { headers: headers }
      )
      .then((response) => {
        let data = response.data.payload[0];
        //console.log(data);
        setAppData(data);
        if (data.attributes.length != 0) {
          let outstr = data.attributes[0];
          for (let i = 1; i < data.attributes.length; i++) {
            outstr += ";" + data.attributes[i];
          }
          setAttribText(outstr);
        }
      })
      .catch((error) => {
        alert("Error while loading API");
        console.log(error);
      });
  }

  loadData();

  return (
    <div>
      <h1 style={{ textAlign: "right", marginRight: "10px" }}>App Setting</h1>
      <div>
        <label style={{ textAlign: "left", marginLeft: "20px" }}>
          App Name
        </label>
        <input type="text" value={appData.appName} disabled />
      </div>
      <div>
        <label style={{ textAlign: "left", marginLeft: "20px" }}>
          Attributes
        </label>
        <input type="text" onChange={handleAttribChange} value={attribText} />
      </div>
      <br />
      <div>
        <label style={{ textAlign: "left", marginLeft: "20px" }}>
          Login Page <br />
        </label>
        <input type="text" value={appData.loginApi} disabled />{" "}
      </div>
      <br />
      <br />
      <label style={{ textAlign: "left", marginLeft: "20px" }}>App ID</label>
      <input
        style={{ width: "20%" }}
        type="text"
        value={appData._id}
        disabled
      />
      <br />
      <br />
      <button onClick={() => updateApp()}> Save </button>
      <br />
      <br />
      <label style={{ textAlign: "left", marginLeft: "20px" }}>
        Desired Attributes <br />
      </label>
      <input type="text" value={secretAttrib} onChange={handleSecretAttrib} />
      <button onClick={() => generateSecret()}> Generate Key </button>
      <br />
      <br />
      <label style={{ textAlign: "left", marginLeft: "20px" }}>
        API Secret Key <br />
      </label>
      <input type="text" value={secret} style={{ width: "80%" }} disabled />
      <br />
      <br />
      <label style={{ textAlign: "left", marginLeft: "20px" }}>
        API Channel Access <br />
      </label>
      <input
        type="text"
        value={channelAccess}
        style={{ width: "30%" }}
        disabled
      />
      <br />
      <br />
      <button
        onClick={() =>
          window.location.replace("/api_list?app_id=" + appData._id)
        }
      >
        Back
      </button>
    </div>
  );
}

export default AppSetting;
