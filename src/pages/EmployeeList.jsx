// src/pages/EmployeeList.jsx

import { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Table, 
  Alert, 
  Spinner, 
  Card, 
  Navbar, 
  Nav 
} from 'react-bootstrap';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async (query = '') => {
    setError('');
    setLoading(true);
    try {
      const url = query ? `/api/employees?name=${query}` : '/api/employees';
      const { data } = await axiosClient.get(url);
      setEmployees(data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Error al obtener la lista de empleados. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Mi Aplicación</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
              <Nav.Link onClick={logout}>Salir</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido Principal */}
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="mb-4 text-center">Listado de Empleados</h2>

                {/* Mensajes de Error */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Formulario de Búsqueda */}
                <Form className="mb-4" onSubmit={(e) => { e.preventDefault(); fetchEmployees(search); }}>
                  <Row className="align-items-center">
                    <Col md={10} sm={9} xs={8}>
                      <Form.Control 
                        type="text" 
                        placeholder="Buscar por nombre" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                      />
                    </Col>
                    <Col md={2} sm={3} xs={4}>
                      <Button variant="primary" type="submit" className="w-100">
                        {loading ? (
                          <>
                            <Spinner 
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />{' '}
                            Buscar...
                          </>
                        ) : (
                          'Buscar'
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>

                {/* Tabla de Empleados */}
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Posición</th>
                      <th>Email</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.length > 0 ? (
                      employees.map(emp => (
                        <tr key={emp.id}>
                          <td>{emp.id}</td>
                          <td>{emp.firstName}</td>
                          <td>{emp.lastName}</td>
                          <td>{emp.position}</td>
                          <td>{emp.email}</td>
                          <td>
                            <Button 
                              variant="warning" 
                              size="sm" 
                              onClick={() => navigate(`/employees/${emp.id}/edit`)}
                              className="me-2"
                            >
                              Editar
                            </Button>
                            {/* Se puede agregar más acciones .... */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No se encontraron empleados.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                {/* Botón Volver */}
                <div className="text-center mt-4">
                  <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                    Volver al Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EmployeeList;
