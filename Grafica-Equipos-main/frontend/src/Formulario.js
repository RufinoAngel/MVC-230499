import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Formulario = ({ equipos }) => {
  const [selectedProyecto, setSelectedProyecto] = useState('');
  const [puntaje, setPuntaje] = useState(0);

  const handleProyectoChange = (event) => {
    const proyectoSeleccionado = event.target.value;
    setSelectedProyecto(proyectoSeleccionado);

    const proyecto = equipos.find((equipo) => equipo.name === proyectoSeleccionado);
    if (proyecto) {
      setPuntaje(proyecto.puntaje);
    }
  };

  const handleAumentarPuntaje = () => {
    if (selectedProyecto !== '') {
      const index = equipos.findIndex((equipo) => equipo.name === selectedProyecto);
      const proyecto = equipos[index];

      if (proyecto && proyecto.puntaje < 40) {
        socket.emit('aumentarPuntaje', index);
      }
    }
  };

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#8b1e3b', marginBottom: '1.5rem' }}>
        DEMOSTRACIÓN DE PROYECTOS INTEGRADORES
      </h2>
      <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>
        DEL ÁREA DE TECNOLOGÍAS DE LA INFORMACIÓN
      </p>

      <label htmlFor="proyecto">Selecciona un Proyecto: </label>
      <select
        id="proyecto"
        value={selectedProyecto}
        onChange={handleProyectoChange}
        style={{
          padding: '10px',
          fontSize: '16px',
          marginLeft: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '200px'
        }}
      >
        <option value="">Seleccionar...</option>
        {equipos.map((equipo) => (
          <option key={equipo.name} value={equipo.name}>
            {equipo.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '1rem' }}>
        <strong>Puntaje alcanzado: </strong> {puntaje}
      </div>

      <button
        onClick={handleAumentarPuntaje}
        style={{
          marginTop: '1rem',
          padding: '10px 20px',
          backgroundColor: '#8b1e3b',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Registrar Puntaje
      </button>
    </div>
  );
};

export default Formulario;
