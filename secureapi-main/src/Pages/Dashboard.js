import { useEffect, useState } from 'react';
import { Row, Col, Container, Card } from "react-bootstrap";

useEffect (()=>{
  let user_id = localStorage.getItem("userID");
  let headers = { accessToken: localStorage.getItem("accessToken"), refreshToken: localStorage.getItem("refreshToken"), iv: localStorage.getItem("iv"), unique: localStorage.getItem("unique")};
  axios.post(user_id, { headers: headers })
  .then(response => {
    console.log('Received response:', response.data);
  })
  .catch(error => {
    console.error('Error sending request:', error);
  });

})


function Dashboard() {
  const [appList, setAppList] = useState(["A", "B", "C"]);
  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ textAlign: "right", marginRight: "10px" }}>
        Hello, Welcome
      </h1>
      <Container fluid>
        {appList.length != 0 ? (
          appList.map((item) => (
            <Row key={item} style={{ margin: "10px" }}>
              <Col>
                {" "}
                <Card>
                  <Card.Body>This is an application card</Card.Body>
                </Card>
              </Col>
            </Row>
          ))
        ) : (
          <Row>No Data to Show</Row>
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
