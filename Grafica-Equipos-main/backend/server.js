const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// Lista de equipos con logos y puntajes iniciales
let equipos = [
  { name: 'BrightBloom', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_Glow.png' }},
  { name: 'SmartPet Solutions', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_Meow.jpg' }},
  { name: 'XicoWeb', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_Ixaya.jpeg' }},
  { name: 'BDMatrix', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_Gym.png' }},
  { name: 'Violet', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_Dimen.png' }},
  { name: 'Xicolab', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_Xicolab.png' }},
  { name: 'MediTech', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_PillBox.png' }},
  { name: 'Virtall', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_iHome.png' }},
  { name: 'DreamStudios', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_Iris.png' }},
  { name: 'SabeRed', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_Sabores.png' }},
  { name: 'MedikOS', puntaje: 0, pictureSettings: { src: 'http://localhost:3000/images/Logo_MedikOS.jpg' }}
];

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.emit('conexionInicial', equipos);

  socket.on('aumentarPuntaje', (index) => {
    if (equipos[index]) {
      equipos[index].puntaje += 1;
      console.log(`Puntaje de ${equipos[index].name} aumentado a ${equipos[index].puntaje}`);
      io.emit('puntajeActualizado', equipos);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(4000, () => {
  console.log('Servidor corriendo en http://localhost:4000');
});
