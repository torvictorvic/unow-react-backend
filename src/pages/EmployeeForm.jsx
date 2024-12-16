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
  Alert, 
  Spinner, 
  Card, 
  Navbar, 
  Nav 
} from 'react-bootstrap';

const EmployeeForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [position, setPosition] = useState('');
  const [positions, setPositions] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPositions = async () => {
    setError('');
    try {
      const { data } = await axiosClient.get('/api/positions');
      setPositions(data.positions);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Error al obtener las posiciones. Por favor, intenta nuevamente.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      // Crear el empleado
      await axiosClient.post('/api/employees', {
        firstName,
        lastName,
        position,
        email,
        birthDate
      });

      // Después de crear el empleado, registrarlo también como usuario:
      await axiosClient.post('/api/register', {
        email,
        password: '123456', // Nota: Considera generar una contraseña segura o permitir que el usuario la establezca
        role: 'EMPLEADO'
      });

      setSuccessMessage('Empleado creado exitosamente. Redirigiendo...');
      setTimeout(() => navigate('/employees'), 2000);
    } catch (error) {
      console.error(error);
      if (error.response) {
        // Manejo de errores específicos del backend
        setError(error.response.data.error || 'Error al crear el empleado.');
      } else {
        setError('Error al crear el empleado. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Mi Aplicación</Navbar.Brand>
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
                <h2 className="mb-4 text-center">Insertar Empleado</h2>

                {/* Mensajes de Error */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Mensaje de Éxito */}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                {/* Formulario de Creación */}
                <Form onSubmit={handleSubmit}>
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

                  <Form.Group controlId="formLastName" className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Ingresa el apellido" 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      required 
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Ingresa el correo electrónico" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </Form.Group>

                  <Form.Group controlId="formBirthDate" className="mb-3">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={birthDate} 
                      onChange={e => setBirthDate(e.target.value)} 
                      required 
                    />
                  </Form.Group>

                  <Form.Group controlId="formPosition" className="mb-4">
                    <Form.Label>Posición</Form.Label>
                    <Form.Select 
                      value={position} 
                      onChange={e => setPosition(e.target.value)} 
                      required
                    >
                      <option value="">Seleccione una posición</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </Form.Select>
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
                      'Guardar'
                    )}
                  </Button>
                </Form>

                {/* Botón de Cancelar */}
                <div className="text-center mt-3">
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

export default EmployeeForm;
