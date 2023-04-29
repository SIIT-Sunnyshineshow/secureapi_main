import { useEffect, useState } from "react";
import { Row, Col, Container, Card } from "react-bootstrap";
import axios from "axios";

function APIList() {
  const [appList, setAppList] = useState([]);

  const [apiName, setApiName] = useState("");
  const [apiLink, setApiLink] = useState("");
  const [allowAttrib, setAllowAttrib] = useState("");

  useEffect(() => {
    let app_id = new URLSearchParams(window.location.search).get("app_id");
    let user_id = localStorage.getItem("userid");

    let headers = {
      accesstoken: localStorage.getItem("accesstoken"),
      refreshtoken: localStorage.getItem("refreshtoken"),
      sessionid: localStorage.getItem("sessionid"),
    };

    axios
      .post(
        "http://localhost:8080/api/app/getapi",
        { user_id: user_id, app_id: app_id },
        {
          headers: headers,
        }
      )
      .then((response) => {
        //console.log("Received response:", response.data);
        if (response.data.code == 200 || response.data.code == 240) {
          //console.log(response.data);
          setAppList(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error sending request:", error);
      });
  });

  const addApi = () => {
    let headers = {
      accesstoken: localStorage.getItem("accesstoken"),
      refreshtoken: localStorage.getItem("refreshtoken"),
      sessionid: localStorage.getItem("sessionid"),
    };

    let app_id = new URLSearchParams(window.location.search).get("app_id");
    let user_id = localStorage.getItem("userid");
    let attrib = allowAttrib.split(";");

    if (!apiName || !apiLink || !app_id || !user_id || !allowAttrib) {
      return;
    }

    let sendingData = {
      apiName: apiName,
      apiLink: apiLink,
      app_id,
      user_id,
      allowedAttributes: attrib,
    };

    axios
      .post("http://localhost:8080/api/app/addapi", sendingData, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.code == 200) {
          console.log(response.data);
        } else {
          throw new Error("Problem with response data");
        }
      })
      .catch((error) => {
        alert("An error has occured, please try again later");
        console.log(error);
      });
  };

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ textAlign: "right", marginRight: "10px" }}>
        Hello, Welcome
      </h1>
      <Container fluid>
        {appList.length != 0 ? (
          appList.map((item) => (
            <Row key={item._id} style={{ margin: "10px" }}>
              <Col>
                {" "}
                <Card>
                  <Card.Header>{item.apiName}</Card.Header>
                  <Card.Body>
                    Attribute:
                    {item.allowedAttributes.map((attrib) => (
                      <div key={attrib}>{attrib}</div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ))
        ) : (
          <Row>No Data to Show</Row>
        )}
      </Container>
      <div>
        <button style={{ float: "right", marginRight: "20px" }}>
          {" "}
          Attributes{" "}
        </button>
        <button style={{ float: "right", marginRight: "20px" }}>
          {" "}
          Config App{" "}
        </button>
      </div>
      <br />
      <div>
        <label for="apiName">New Api Name:</label>
        <input id="apiName" onChange={(e) => setApiName(e.target.value)} />
        <br />
        <label for="apiLink">Api Link:</label>
        <input id="apiLink" onChange={(e) => setApiLink(e.target.value)} />
        <br />
        <label for="attrib">Attribute:</label>
        <input
          id="attrib"
          onChange={(e) => setAllowAttrib(e.target.value)}
        />{" "}
        <span>Seperate it with "; "</span>
        <br />
        <input type="button" value="Create new app" onClick={() => addApi()} />
      </div>
    </div>
  );
}

export default APIList;
