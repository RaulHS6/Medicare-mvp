import { useState } from 'react';
import api from '../services/api';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
			await api.post('/auth/register', { email, password });
      setMessage('Usuario creado correctamente');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;
