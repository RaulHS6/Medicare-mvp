import React from 'react';

function Dashboard() {
  // Aquí se debería obtener el rol del usuario autenticado (ejemplo: desde localStorage o contexto)
  const rol = localStorage.getItem('rol') || 'paciente';

  return (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      {rol === 'admin' && <p>Vista de administrador: gestiona usuarios, roles y configuración.</p>}
      {rol === 'medico' && <p>Vista de médico: accede a expedientes y agenda de tus pacientes.</p>}
      {rol === 'paciente' && <p>Vista de paciente: consulta tu expediente y agenda tus citas.</p>}
    </div>
  );
}

export default Dashboard; 