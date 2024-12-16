import { createContext, useState, useEffect } from 'react';
// import jwt_decode from 'jwt-decode';  // 
import { parseJwt } from '../api/jwt';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [roles, setRoles] = useState([]);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (token) {
      // const decoded = jwt_decode(token); // No funciona!
      const decoded = parseJwt(token); // function local
      setRoles(decoded.roles || []);
      setUsername(decoded.username || null);
      localStorage.setItem('token', token);
    } else {
      setRoles([]);
      setUsername(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, roles, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
