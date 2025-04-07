import React, { useState, useEffect } from 'react';
import Formulario from './Formulario';
import Grafica from './Grafica';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');  // URL de tu servidor

function App() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-800 to-zinc-900 text-white flex flex-col items-center justify-center px-4 py-8">
    
      
      {/* Gráfica para mostrar puntajes */}
      <Grafica />
    </div>
  );
}

export default App;
