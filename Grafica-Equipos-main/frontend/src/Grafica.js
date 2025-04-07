import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import io from "socket.io-client";

// Conexión al servidor socket
const socket = io("http://localhost:4000");

export default function Grafica() {
  const [equipos, setEquipos] = useState([]);
  const chartRef = useRef(null);
  const [selectedProyecto, setSelectedProyecto] = useState("");
  const [puntaje, setPuntaje] = useState("");

  // Obtener datos iniciales
  useEffect(() => {
    socket.on("conexionInicial", (data) => {
      setEquipos(data);
    });

    return () => {
      socket.off("conexionInicial");
    };
  }, []);

  // Crear gráfico
  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 30,
        background: am5.Rectangle.new(root, {
          fill: am5.color(0xf3f6f4),
          fillOpacity: 1,
        }),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: am5xy.AxisRendererY.new(root, { minorGridEnabled: true }),
        paddingRight: 40,
        cellHeight: 50,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 170,
        interval: 15,
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 60 }),
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Puntaje",
        xAxis,
        yAxis,
        valueXField: "puntaje",
        categoryYField: "name",
        sequencedInterpolation: true, // Animación secuencial
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          dy: -30,
          labelText: "{valueX}",
          background: am5.Rectangle.new(root, {
            fill: am5.color(0x79142f),
            fillOpacity: 0.95,
          }),
        }),
      })
    );

    // Definir el template para el círculo
    const circleTemplate = am5.Template.new({});

    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 25,
      cornerRadiusTR: 25,
      maxHeight: 50,
      fillOpacity: 0.9,
      tooltipText: "{valueX}",
    });

    // Configuración de los "bullets" (los círculos)
    series.bullets.push((root, series, dataItem) => {
      const bulletContainer = am5.Container.new(root, {});
      bulletContainer.children.push(am5.Circle.new(root, { radius: 35 }, circleTemplate));

      const maskCircle = bulletContainer.children.push(am5.Circle.new(root, { radius: 30 }));
      const imageContainer = bulletContainer.children.push(am5.Container.new(root, { mask: maskCircle }));
      imageContainer.children.push(
        am5.Picture.new(root, {
          templateField: "pictureSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 60,
          height: 60,
        })
      );

      return am5.Bullet.new(root, {
        locationX: 0,
        sprite: bulletContainer,
      });
    });

    // Reglas de color de la animación
    series.set("heatRules", [
      {
        dataField: "valueX",
        min: am5.color(0xd5aebb),
        max: am5.color(0x79142f),
        target: series.columns.template,
        key: "fill",
      },
      {
        dataField: "valueX",
        min: am5.color(0xf4f5f4),
        max: am5.color(0x79142f),
        target: circleTemplate,
        key: "fill",
      },
    ]);

    const updateChart = (data) => {
      setEquipos(data);
      series.data.setAll(data);
      yAxis.data.setAll(data);
    };

    socket.on("conexionInicial", updateChart);
    socket.on("puntajeActualizado", updateChart);

    return () => {
      root.dispose();
      socket.off("conexionInicial", updateChart);
      socket.off("puntajeActualizado", updateChart);
    };
  }, []);

  // Manejadores del formulario
  const handleProyectoChange = (e) => setSelectedProyecto(e.target.value);
  const handlePuntajeChange = (e) => setPuntaje(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const index = equipos.findIndex((e) => e.name === selectedProyecto);
    if (index !== -1 && puntaje !== "") {
      for (let i = 0; i < parseInt(puntaje); i++) {
        socket.emit("aumentarPuntaje", index);
      }
      setPuntaje("");
    }
  };

  return (
    <div style={{ background: "#f4f5f4", minHeight: "100vh", paddingTop: "2rem" }}>
      <h2 style={{ textAlign: "center", color: "#8b1e3b", fontSize: "28px", marginBottom: "1rem", fontWeight: "800" }}>
        <span style={{ fontSize: "34px", fontWeight: "900", display: "block" }}>
          DEMOSTRACIÓN DE PROYECTOS INTEGRADORES
        </span>
        <span style={{ color: "#404040", fontSize: "26px", fontWeight: "600", display: "block" }}>
          del Área de Tecnologías de la Información
        </span>
      </h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <div style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px"
        }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "22px", color: "#8b1e3b", textAlign: "center", fontWeight: "700" }}>
            Registrar Puntaje
          </h3>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="proyecto" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>
              Selecciona un Proyecto
            </label>
            <select
              id="proyecto"
              value={selectedProyecto}
              onChange={handleProyectoChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px"
              }}
            >
              <option value="">-- Selecciona --</option>
              {equipos.map((e) => (
                <option key={e.name} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="puntaje" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>
              Puntaje alcanzado
            </label>
            <input
              type="number"
              id="puntaje"
              value={puntaje}
              onChange={handlePuntajeChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#8b1e3b",
              color: "#fff",
              padding: "12px 20px",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Registrar Puntaje
          </button>
        </div>
      </form>

      {/* Contenedor del gráfico */}
      <div
        ref={chartRef}
        style={{
          width: "90%",
          height: "820px",
          margin: "0 auto",
          background: "#404040",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 10px 100px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}
      ></div>
    </div>
  );
}
