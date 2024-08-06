function d3BarChart(datasetBarChart) {
    const margin = { top: 20, right: 10, bottom: 20, left: 50 };
    const width = 350 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
        .domain(datasetBarChart.map(d => d.category))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    const svg = d3.select('#barChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => `${d}%`));

        const title = svg.append('text')
        .attr('x', margin.left) // Adjusted to move closer to the y-axis
        .attr('y', margin.top)
        .attr('text-anchor', 'start') // Align the text to the start
        .attr('dominant-baseline', 'hanging') // Align the text to the top
        .attr('class', 'title')
        .style('font-weight', 'bold')
        .style('font-size', '14px')
        .text('Race Distribution');

    function drawBars(data, group) {
        // Update title text based on the group
        if (group === "overall") {
            title.text('Race Distribution');
        } else if (group === "male") {
            title.text('Race Distribution - Male');
        } else if (group === "female") {
            title.text('Category Distribution - Female');
        }

        // Remove existing bars and labels before adding new ones
        svg.selectAll('.bar').remove();
        svg.selectAll('.label').remove();

        // Add new bars
        svg.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.category))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.value))
            .attr('fill', '#7b6888');

        // Add new labels
        svg.selectAll('.label')
            .data(data)
            .enter().append('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d.category) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.value) - 5)
            .attr('text-anchor', 'middle')
            .text(d => `${d.value}%`);
    }

    // Initially, draw the bar chart without any filtering
    drawBars(datasetBarChart.filter(d => d.group === "overall"), "overall");

    // Add event listeners for pie chart interaction
    d3.selectAll('.pie-slice').on('click', function(event, d) {
        let filteredData;
        if (d.data.label === "Male") {
            filteredData = datasetBarChart.filter(data => data.group === "male");
            drawBars(filteredData, "male");
        } else if (d.data.label === "Female") {
            filteredData = datasetBarChart.filter(data => data.group === "female");
            drawBars(filteredData, "female");
        } else {
            filteredData = datasetBarChart.filter(data => data.group === "overall");
            drawBars(filteredData, "overall");
        }
    });
}
