import { useEffect, useState } from "react";
import { Row, Col, Container, Card } from "react-bootstrap";
import axios from "axios";

function Dashboard() {
  useEffect(() => {
    let headers = {
      accesstoken: localStorage.getItem("accesstoken"),
      refreshtoken: localStorage.getItem("refreshtoken"),
      sessionid: localStorage.getItem("sessionid"),
    };
    let user_id = localStorage.getItem("userid");
    axios
      .post(
        "http://localhost:8080/api/app/getapp",
        { user_id: user_id },
        {
          headers: headers,
        }
      )
      .then((response) => {
        console.log("Received response:", response.data);
        if (response.data.code == 200 || response.data.code == 240) {
          setAppList(response.data.payload);
        }
      })
      .catch((error) => {
        console.error("Error sending request:", error);
      });
  });
  const [appList, setAppList] = useState([]);
  const [appName, setAppName] = useState("");

  const handleAppNameChange = (e) => {
    setAppName(e.target.value);
  };

  const [loginLink, setLoginLink] = useState("");
  const handleLinkChange = (e) => {
    setLoginLink(e.target.value);
  };

  const addNewApp = () => {
    let headers = {
      accesstoken: localStorage.getItem("accesstoken"),
      refreshtoken: localStorage.getItem("refreshtoken"),
      sessionid: localStorage.getItem("sessionid"),
    };
    console.log(headers);
    if (!appName) {
      return;
    }

    if (!loginLink) {
      return;
    }
    let user_id = localStorage.getItem("userid");
    axios
      .post(
        "http://localhost:8080/api/app/addapp",
        {
          appName: appName,
          user_id: user_id,
          loginApi: loginLink,
          cbLogin: loginLink,
        },
        {
          headers: headers,
        }
      )
      .then((response) => {
        //console.log(response);
        if (response.data.code == 200) {
          alert("Update Successful");
        } else {
          throw new Error("Internal Error");
        }
      })
      .catch((error) => {
        console.log("An error occured");
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
                  <button
                    onClick={() =>
                      window.location.replace("/api_list?app_id=" + item._id)
                    }
                  >
                    <Card.Body> App Name:{item.appName}</Card.Body>
                  </button>
                </Card>
              </Col>
            </Row>
          ))
        ) : (
          <Row>No Data to Show</Row>
        )}
      </Container>
      <div>
        <label for="appNameIn">New App Name:</label>
        <input id="appNameIn" onChange={handleAppNameChange} />
        <br />
        <label for="loginLink">Login Link:</label>
        <input id="loginLink" onChange={handleLinkChange} />
        <br />
        <input
          type="button"
          onClick={() => addNewApp()}
          value="Create new app"
        />
      </div>
    </div>
  );
}

export default Dashboard;
