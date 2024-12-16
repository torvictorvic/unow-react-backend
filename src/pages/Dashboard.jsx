import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Navbar, Nav, Alert } from 'react-bootstrap';

const Dashboard = () => {
  const { logout, roles } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /*
  useEffect(() => {
    // Ir automáticamente a "/employees" cuando monte el componente
    navigate('/employees');
  }, [navigate]);
  */

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">UNOW | Registro de Personal</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/login')}>Salir</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido Principal */}
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="mb-4 text-center">Dashboard (Usuario)</h2>
                <Row className="mb-3">
                  <Col>
                    <Button 
                      variant="primary" 
                      className="w-100" 
                      onClick={() => navigate('/employees')}
                    >
                      Ver Empleados
                    </Button>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Button 
                      variant="success" 
                      className="w-100" 
                      onClick={() => navigate('/employees/new')}
                    >
                      Insertar Empleado
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button 
                      variant="danger" 
                      className="w-100" 
                      onClick={handleLogout}
                    >
                      Salir
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
