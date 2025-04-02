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
  .then(data =>   {
    // データ処理
  
    }); 





 svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height})`);
    // Y軸追加
  svg.append("g")
      .attr("id", "y-axis")
      .attr(d => d.month)
      
       

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
      


const colorScale = d3.scaleOrdinal()
  .domain([ 0 , 1, 2, 3]) // Ajusta según la cantidad de categorías
  .range(["red", "blue", "green", "orange"]); // 4 colores mínimos



const dataset = [
  { year: 2000, month: 0, value: 10 },
  { year: 2001, month: 1, value: 15 },
  { year: 2002, month: 2, value: 20 },
  // Más datos...
];




svg.selectAll(".cell")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("width", 40) // Ajusta el tamaño según sea necesario
  .attr("height", 40)
  .attr("x", d => (d.year - d3.min(dataset, d => d.year)) * 45) // Espaciado entre columnas (años)

  .attr("fill", d => colorScale(d.value))
  .attr("data-month", d => d.month)
  .attr("data-year", d => d.year)
  .on("mouseover", function (event, d) {
    tooltip.style("display", "block")
      .html(`Year: ${d.year}, Month: ${d.month + 1}, Value: ${d.value}`);
  })
  .on("mouseout", () => tooltip.style("display", "none"));
  