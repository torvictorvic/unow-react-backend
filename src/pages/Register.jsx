import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // Para mensajes de error
  const [loading, setLoading] = useState(false); // Para indicar el estado de carga
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/api/register', {
        email,
        password,
        role: 'USUARIO'
      });
      setMessage('Usuario creado exitosamente');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error(error);
      setError('Error al crear usuario. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4 text-center">Registrar Usuario</h2>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleRegister}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Ingresa tu correo electrónico" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Ingresa tu contraseña" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
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
                      Registrando...
                    </>
                  ) : (
                    'Registrar'
                  )}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Button variant="link" onClick={() => navigate('/')}>
                  Regresar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
