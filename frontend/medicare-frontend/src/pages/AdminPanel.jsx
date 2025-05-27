import React from 'react';

function AdminPanel() {
  return (
    <div>
      <h2>Panel de Administración</h2>
      <ul className="list-group">
        <li className="list-group-item">Gestión de usuarios</li>
        <li className="list-group-item">Logs del sistema</li>
        <li className="list-group-item">Configuración general</li>
      </ul>
    </div>
  );
}

export default AdminPanel; 