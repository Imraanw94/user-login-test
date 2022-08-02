import "bootstrap/dist/css/bootstrap.min.css"; // Import some styling from Bootstrap
import { Component } from "react";
import { Container } from "react-bootstrap";
import "./App.css";
import AuthComponent from "./Components/AuthComponent";
import Header from "./Components/Header/Header";

class App extends Component {
  render() {
    return (
      <Container style={{ marginTop: "5px" }}>
        <div>
          <Header />
          <hr></hr>
          <AuthComponent />
        </div>
      </Container>
    );
  }
}

export default App;
