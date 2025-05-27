import React from 'react';

function Expedientes() {
  // Simulación de rol
  const rol = localStorage.getItem('rol') || 'paciente';

  return (
    <div>
      <h2>Expedientes Clínicos</h2>
      <p>Aquí puedes visualizar los datos médicos.</p>
      {rol === 'medico' && <button className="btn btn-warning mt-3">Editar expediente</button>}
    </div>
  );
}

export default Expedientes; 