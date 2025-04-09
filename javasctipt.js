const margin = { top: 60, right: 20, bottom: 100, left: 100 };
  const width = 1200 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select("svg")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const tooltip = d3.select("#tooltip");

  d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(dataset => {
    const baseTemp = dataset.baseTemperature;
    const data = dataset.monthlyVariance.map(d => ({
      year: d.year,
      month: d.month - 1, // meses 0-indexados
      temp: baseTemp + d.variance,
      variance: d.variance
    }));

    const years = [...new Set(data.map(d => d.year))];

    const xScale = d3.scaleBand()
      .domain(years)
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(d3.range(12))
      .range([0, height]);

    const colorScale = d3.scaleQuantize()
      .domain(d3.extent(data, d => d.temp))
      .range(["#4575b4", "#91bfdb", "#fee090", "#fc8d59", "#d73027"]);

    const xAxis = d3.axisBottom(xScale)
      .tickValues(years.filter(year => year % 10 === 0))
      .tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => months[d]);

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis);

    // Celdas del mapa de calor
    svg.selectAll(".cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", d => d.month)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => d.temp)
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d.month))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.temp))
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", 1)
          .html(`Año: ${d.year}<br>Mes: ${months[d.month]}<br>Temp: ${d.temp.toFixed(2)}°C<br>Varianza: ${d.variance.toFixed(2)}°C`)
          .attr("data-year", d.year)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Leyenda
    const legendColors = [
      "#4575b4",
      "#91bfdb",
      "#fee090",
      "#fc8d59",
      "#d73027"
    ];

    const legendWidth = 300;
    const legendHeight = 20;

    const legend = svg.append("g")
      .attr("id", "legend")
      .attr("transform", `translate(0, ${height + 60})`);

    const legendScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.temp))
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(legendColors.length);

    legend.selectAll("rect")
      .data(legendColors)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (legendWidth / legendColors.length))
      .attr("y", 0)
      .attr("width", legendWidth / legendColors.length)
      .attr("height", legendHeight)
      .attr("fill", d => d);

    legend.append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis);
  });