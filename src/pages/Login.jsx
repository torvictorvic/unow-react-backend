import { useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { parseJwt } from '../api/jwt';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setError('');
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/api/login', { email, password });
      // Guardar el token
      login(data.token);

      // Decodificar token para saber el rol antes de navegar
      const decoded = parseJwt(data.token);
      
      if (decoded.roles && decoded.roles.includes('USUARIO')) {
        navigate('/dashboard');
      } else if (decoded.roles && decoded.roles.includes('EMPLEADO')) {
        navigate('/me');
      } else {
        // Si no hay rol reconocido, redirigir a login o algún lugar por defecto
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      setError('Credenciales incorrectas');
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
              <h2 className="mb-4 text-center">Iniciar Sesión</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
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
                      Iniciando...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Button variant="link" onClick={() => navigate('/register')}>
                  Registrar un usuario
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
