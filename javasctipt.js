// SVGの設定
const margin = {top: 80, right: 20, bottom: 80, left: 100};
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// メインSVGの作成
const svg = d3.select("#visualization")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// データのURL
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// データを読み込み・処理する
d3.json(url).then(data => {
  const baseTemperature = data.baseTemperature;
  const monthlyData = data.monthlyVariance;
  
  // 日付と値を処理する
  monthlyData.forEach(d => {
    d.year = +d.year;
    d.month = +d.month - 1; // JavaScript用に0〜11に変換
    d.temperature = baseTemperature + d.variance;
    d.date = new Date(d.year, d.month);
  });
  
  // スケールの定義
  const xScale = d3.scaleBand()
    .domain(d3.range(d3.min(monthlyData, d => d.year), d3.max(monthlyData, d => d.year) + 1))
    .range([0, width])
    .padding(0.01);
  
  const yScale = d3.scaleBand()
    .domain(d3.range(0, 12))
    .range([0, height])
    .padding(0.01);
  
  // カラースケール
  const minTemp = d3.min(monthlyData, d => d.temperature);
  const maxTemp = d3.max(monthlyData, d => d.temperature);
  const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
    .domain([maxTemp, minTemp]); // 赤が暑く、青が寒くなるように反転
  
  // 軸の設定
  const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(year => year % 10 === 0)); // 10年ごとに表示
  
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(month => {
      const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", 
                          "7月", "8月", "9月", "10月", "11月", "12月"];
      return monthNames[month];
    });
  
  // 軸の描画
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("fill", "red")          // テキストの色
    .style("font-size", "12px")    // フォントサイズ
    .style("font-weight", "bold"); // フォントの太さ
  
  svg.append("g")
    .attr("id", "y-axis")
    .call(yAxis)
    .selectAll("text")
    .style("fill", "red")          // テキストの色
    .style("font-size", "12px")    // フォントサイズ
    .style("font-weight", "bold"); // フォントの太さ
  
  // 軸ラベル
  svg.append("text")
    .attr("transform", `translate(${width / 2},${height + margin.bottom - 10})`)
    .style("text-anchor", "middle")
    .text("年");
  
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .text("月");
  
  // ヒートマップのセルを作成
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
      const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月",
                          "7月", "8月", "9月", "10月", "11月", "12月"];
     
      d3.select("#tooltip")
        .style("display", "block")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px")
        .html(`${monthNames[d.month]} ${d.year}<br>
              気温: ${d.temperature.toFixed(2)}℃<br>
              差異: ${d.variance.toFixed(2)}℃`)
        .attr("data-year", d.year);
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("display", "none");
    });
  
  // 凡例（レジェンド）
  // 温度範囲をステップに分けたスケール
  const legendColors = [
    "#313695", "#4575b4", "#74add1", "#abd9e9",
    "#e0f3f8", "#fee090", "#fdae61", "#f46d43", "#d73027"
  ];

  const legendThreshold = d3.scaleThreshold()
    .domain(d3.range(minTemp, maxTemp, (maxTemp - minTemp) / (legendColors.length - 1)))
    .range(legendColors);

  // 凡例用のグループを作成
  const legendWidth = 400;
  const legendHeight = 30;
  const legendRectWidth = legendWidth / legendColors.length;

  const legend = svg.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${width - legendWidth - 20}, ${height + 50})`);

  // カラーボックスを追加
  legend.selectAll("rect")
    .data(legendColors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * legendRectWidth)
    .attr("y", 0)
    .attr("width", legendRectWidth)
    .attr("height", legendHeight)
    .attr("fill", d => d);

  // 凡例の軸（目盛り付き）
  const legendScale = d3.scaleLinear()
    .domain([minTemp, maxTemp])
    .range([0, legendWidth]);

  const legendAxis = d3.axisBottom(legendScale)
    .ticks(legendColors.length)
    .tickFormat(d => d.toFixed(1) + "℃");

  legend.append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(legendAxis);

  // グラデーション用のストップ追加
  const stops = [
    {offset: "0%", color: d3.interpolateRdYlBu(0)},
    {offset: "100%", color: d3.interpolateRdYlBu(1)}
  ];

  linearGradient.selectAll("stop")
    .data(stops)
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  
  
  
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
    .attr("transform", `translate(0,${legendHeight})`)
    .call(legendAxis);

}).catch(error => {
  console.error("データの読み込みエラー:", error);
});