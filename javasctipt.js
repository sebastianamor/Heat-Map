// Configuración del SVG
const margin = {top: 80, right: 20, bottom: 80, left: 100};
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
 
// Crear SVG principal
const svg = d3.select("#visualization")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// URL de los datos
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Cargar y procesar los datos
d3.json(url).then(data => {
  const baseTemperature = data.baseTemperature;
  const monthlyData = data.monthlyVariance;
  
  // Procesar fechas y valores
  monthlyData.forEach(d => {
    d.year = +d.year;
    d.month = +d.month - 1; // Convertir a 0-11 para JavaScript
    d.temperature = baseTemperature + d.variance;
    d.date = new Date(d.year, d.month);
  });
  
  // Escalas
  const xScale = d3.scaleBand()
    .domain(d3.range(d3.min(monthlyData, d => d.year), d3.max(monthlyData, d => d.year) + 1))
    .range([0, width])
    .padding(0.01);
  
  const yScale = d3.scaleBand()
    .domain(d3.range(0, 12))
    .range([0, height])
    .padding(0.01);
  
  // Escala de colores
  const minTemp = d3.min(monthlyData, d => d.temperature);
  const maxTemp = d3.max(monthlyData, d => d.temperature);
  const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
    .domain([maxTemp, minTemp]); // Invertido para que rojo sea caliente y azul frío
  
  // Ejes
  const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(year => year % 10 === 0)); // Mostrar cada 10 años
  
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(month => {
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                         "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return monthNames[month];
    });
  
  // Dibujar ejes
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);
  
  svg.append("g")
    .attr("id", "y-axis")
    .call(yAxis);
  
  // Etiquetas de ejes
  svg.append("text")
    .attr("transform", `translate(${width / 2},${height + margin.bottom - 10})`)
    .style("text-anchor", "middle")
    .text("Año");
  
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .text("Mes");
  
  // Crear celdas del mapa de calor
  svg.selectAll(".cell")
    .data(monthlyData)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", d => colorScale(d.temperature))
    .attr("data-year", d => d.year)
    .attr("data-month", d => d.month)
    .attr("data-temp", d => d.temperature)
    .on("mouseover", function(event, d) {
      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                         "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      
      d3.select("#tooltip")
        .style("display", "block")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px")
        .html(`${monthNames[d.month]} ${d.year}<br>
              Temperatura: ${d.temperature.toFixed(2)}℃<br>
              Varianza: ${d.variance.toFixed(2)}℃`)
        .attr("data-year", d.year);
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("display", "none");
    });
  
  // Leyenda
 // Escala para la leyenda (dividir el rango de temperatura en pasos)
const legendColors = [
"#313695", "#4575b4", "#74add1", "#abd9e9",
"#e0f3f8", "#fee090", "#fdae61", "#f46d43", "#d73027"
];

const legendThreshold = d3.scaleThreshold()
.domain(d3.range(minTemp, maxTemp, (maxTemp - minTemp) / (legendColors.length - 1)))
.range(legendColors);

// Crear grupo para la leyenda
const legendWidth = 400;
const legendHeight = 30;
const legendRectWidth = legendWidth / legendColors.length;

const legend = svg.append("g")
.attr("id", "legend")
.attr("transform", `translate(${width - legendWidth - 20}, ${height + 50})`);

// Agregar rectángulos de color
legend.selectAll("rect")
.data(legendColors)
.enter()
.append("rect")
.attr("x", (d, i) => i * legendRectWidth)
.attr("y", 0)
.attr("width", legendRectWidth)
.attr("height", legendHeight)
.attr("fill", d => d);

// Eje de la leyenda con ticks
const legendScale = d3.scaleLinear()
.domain([minTemp, maxTemp])
.range([0, legendWidth]);

const legendAxis = d3.axisBottom(legendScale)
.ticks(legendColors.length)
.tickFormat(d => d.toFixed(1) + "℃");

legend.append("g")
.attr("transform", `translate(0, ${legendHeight})`)
.call(legendAxis);

  
  // Añadir paradas de color al gradiente
  const stops = [
    {offset: "0%", color: d3.interpolateRdYlBu(0)},
    {offset: "100%", color: d3.interpolateRdYlBu(1)}
  ];
  
  linearGradient.selectAll("stop")
    .data(stops)
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);
  
  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#linear-gradient)");
  
  legend.append("g")
    .attr("transform", `translate(0,${legendHeight})`)
    .call(legendAxis);
  
}).catch(error => {
  console.error("Error al cargar los datos:", error);
});