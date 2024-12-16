import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Alert, 
  Spinner, 
  Card, 
  Navbar, 
  Nav 
} from 'react-bootstrap';

const EmployeeEdit = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [firstName, setFirstName] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployee = async () => {
    setError('');
    setLoading(true);
    try {
      // Solución Temporal: Obtener todos los empleados y filtrar en frontend
      const { data } = await axiosClient.get(`/api/employees`);
      const emp = data.find(e => e.id === parseInt(id));
      if (emp) {
        setEmployee(emp);
        setFirstName(emp.firstName);
      } else {
        setError('Empleado no encontrado.');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Error al obtener los datos del empleado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setError('');
    setUpdateMessage('');
    setLoading(true);
    try {
      await axiosClient.put(`/api/employees/${id}`, {
        firstName
      });
      setUpdateMessage('Empleado actualizado exitosamente.');
      // Opcional: Redirigir después de un breve retraso
      setTimeout(() => navigate('/employees'), 2000);
    } catch (error) {
      console.error(error);
      setError('Error al actualizar el empleado. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !employee) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
        <Navbar.Brand href="#">UNOW | Registro de Personal</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/employees')}>Listado de Empleados</Nav.Link>
              <Nav.Link onClick={logout}>Salir</Nav.Link>
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
                <h2 className="mb-4 text-center">Editar Empleado {id}</h2>

                {/* Mensajes de Error */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Mensaje de Éxito */}
                {updateMessage && <Alert variant="success">{updateMessage}</Alert>}

                {/* Formulario de Edición */}
                <Form onSubmit={handleUpdate}>
                  <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Ingresa el nombre" 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      required 
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </Button>
                </Form>

                {/* Botones de Cancelar */}
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="secondary" onClick={() => navigate('/employees')}>
                    Cancelar
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

export default EmployeeEdit;
