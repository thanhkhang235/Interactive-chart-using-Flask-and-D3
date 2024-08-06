function d3PieChart(dataset) {
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 350 - margin.left - margin.right,
          height = 350 - margin.top - margin.bottom,
          outerRadius = Math.min(width, height) / 2,
          innerRadius = outerRadius * 0.5,
          color = d3.scaleOrdinal(d3.schemeAccent);
  
    const svg = d3.select('#pieChart')
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
  
    const data = d3.pie()
        .sort(null)
        .value(d => d.value)(dataset);
  
    const arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(0);
  
    const innerArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  
    const arcs = svg.selectAll("g.slice")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "slice");
  
    arcs.append("path")
        .attr("fill", (d, i) => color(i))
        .attr("d", arc)
        .on("click", function(event, d) {
            const group = d.data.category;
            const color = d3.select(this).attr('fill');
            updateBarChart(group, color); // Call updateBarChart on click
        })
        .append("title")
        .text(d => `${d.data.category}: ${d.data.value}%`);
  
    arcs.filter(d => d.endAngle - d.startAngle > .1)
        .append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("transform", d => "translate(" + innerArc.centroid(d) + ")")
        .text(d => `${d.data.category}: ${d.data.value}%`); // Display category and percentage
  
    svg.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text("Students by Gender")
        .attr("class", "title");
  }
  