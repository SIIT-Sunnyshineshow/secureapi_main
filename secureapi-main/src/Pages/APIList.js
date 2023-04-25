import { useState } from "react";
import { Row, Col, Container, Card } from "react-bootstrap";

function APIList() {
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
      <button style={{ float: "right", marginRight: "20px" }}> {" "}Attributes{" "}</button>
      <button style={{ float: "right", marginRight: "20px" }}> {" "}Config App{" "}</button>


    </div>
  );
}

export default APIList;
