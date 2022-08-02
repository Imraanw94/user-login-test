import { Container, Navbar } from "react-bootstrap";

// The Menu Component Function
function Menu(props) {
  return (
    <Navbar bg="dark" expand="lg" style={{ borderRadius: "10px" }}>
      <Container>
        <h1 style={{ color: "white" }}>Todo App</h1>
      </Container>
    </Navbar>
  );
}

export default Menu;
