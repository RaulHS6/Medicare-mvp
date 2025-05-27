import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-3" style={{ borderBottom: '1px solid #eee' }}>
      <div className="container-fluid px-3">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="fa-solid fa-shield-heart text-primary"></i>
          MediSecure
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {rol && <li className="nav-item"><Link className="nav-link" to="/dashboard"><i className="fa-solid fa-house"></i> Dashboard</Link></li>}
            {rol === 'medico' && <li className="nav-item"><Link className="nav-link" to="/agenda"><i className="fa-solid fa-calendar-check"></i> Agenda</Link></li>}
            {rol && <li className="nav-item"><Link className="nav-link" to="/expedientes"><i className="fa-solid fa-file-medical"></i> Expedientes</Link></li>}
            {rol === 'admin' && <li className="nav-item"><Link className="nav-link" to="/admin"><i className="fa-solid fa-gears"></i> Administración</Link></li>}
          </ul>
          <ul className="navbar-nav">
            {!rol && <li className="nav-item"><Link className="nav-link" to="/login"><i className="fa-solid fa-right-to-bracket"></i> Login</Link></li>}
            {!rol && <li className="nav-item"><Link className="nav-link" to="/register"><i className="fa-solid fa-user-plus"></i> Registro</Link></li>}
            {rol && <li className="nav-item"><button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Salir</button></li>}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 