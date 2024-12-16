import { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Alert, 
  Spinner, 
  Form, 
  Navbar, 
  Nav, 
  Modal 
} from 'react-bootstrap';

const EmployeeOwnProfile = () => {
  const { username, logout } = useContext(AuthContext);
  const [employee, setEmployee] = useState(null);
  const [positions, setPositions] = useState([]);
  const [editPosition, setEditPosition] = useState(false);
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
    fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployee = async () => {
    setError('');
    setLoading(true);
    try {
      // Solución rapida: obtener todos los empleados y filtrar en frontend
      // Mejora         : crear un endpoint específico como /api/employees?email={email}
      const { data } = await axiosClient.get('/api/employees');
      const emp = data.find(e => e.email === username);
      if (emp) {
        setEmployee(emp);
        setPosition(emp.position);
      } else {
        setError('Empleado no encontrado.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Error al obtener los datos del empleado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    setError('');
    try {
      const { data } = await axiosClient.get('/api/positions');
      setPositions(data.positions);
    } catch (err) {
      console.error(err);
      setError('Error al obtener las posiciones disponibles.');
    }
  };

  const handleUpdatePosition = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await axiosClient.put(`/api/employees/${employee.id}`, {
        position
      });
      setSuccessMessage('Posición actualizada exitosamente.');
      setEditPosition(false);
      fetchEmployee();
    } catch (err) {
      console.error(err);
      setError('Error al actualizar la posición. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await axiosClient.delete(`/api/employees/${employee.id}`);
      setSuccessMessage('Tu registro ha sido eliminado exitosamente.');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Error al eliminar tu registro. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
              <Nav.Link onClick={handleLogout}>Salir</Nav.Link>
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
                <h2 className="mb-4 text-center">Mi Perfil</h2>

                {/* Mensajes de Error */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Mensaje de Éxito */}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                {/* Información del Empleado */}
                {employee && (
                  <>
                    <p><strong>Nombre:</strong> {employee.firstName}</p>
                    <p><strong>Apellido:</strong> {employee.lastName}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {new Date(employee.birthDate).toLocaleDateString()}</p>
                    <p>
                      <strong>Posición:</strong>{' '}
                      {editPosition ? (
                        <>
                          <Form.Select 
                            value={position} 
                            onChange={e => setPosition(e.target.value)} 
                            className="d-inline-block w-auto me-2"
                          >
                            <option value="">Seleccione una posición</option>
                            {positions.map(pos => (
                              <option key={pos} value={pos}>{pos}</option>
                            ))}
                          </Form.Select>
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={handleUpdatePosition} 
                            disabled={loading}
                          >
                            {loading ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              'Guardar'
                            )}
                          </Button>{' '}
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setEditPosition(false)}
                            disabled={loading}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          {employee.position}{' '}
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => setEditPosition(true)}
                          >
                            Editar
                          </Button>
                        </>
                      )}
                    </p>

                    {/* Botones de Acción */}
                    <div className="d-flex justify-content-between mt-4">
                      <Button 
                        variant="danger" 
                        onClick={() => setShowDeleteModal(true)} 
                        disabled={loading}
                      >
                        Eliminar mi Registro
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={handleLogout} 
                        disabled={loading}
                      >
                        Salir
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal de Confirmación para Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar tu registro? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeeOwnProfile;
