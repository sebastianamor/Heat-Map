const margin = {top: 80, right: 100, bottom: 80, left: 100};
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#description")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

  // ツールチップ
const tooltip = d3.select("#tooltip");

// データ読み込み
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(data => {
    // データ処理
  
    }); 

 svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height})`);
    // Y軸追加
  svg.append("g")
      .attr("id", "y-axis");
 

d3.select("g")
  .selectAll(".cell")
  .append("div")
  .attr("class", "cell");


const cell = svg.append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${width - 150}, 20)`);




    // ドーピングなし凡例
    cell.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "red");


const colorScale = d3.scaleOrdinal()
  .domain([0, 1, 2, 3]) // Ajusta según la cantidad de categorías
  .range(["red", "blue", "green", "orange"]); // 4 colores mínimos

// Selecciona las celdas y asigna un color basado en los datos
svg.selectAll(".cell")
  .data([0, 1, 2, 3]) // Simulación de datos, reemplázalo con los tuyos
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("width", 20)
  .attr("height", 20)
  .attr("x", (d, i) => i * 25) // Espaciado entre celdas
  .attr("y", 50)
  .attr("fill", d => colorScale(d));

  