
function updateBarChart(group, color) {
    const barChartDataUrl = `/get_barchart_data`;
    d3.json(barChartDataUrl).then(datasetBarChart => {
        const filteredData = datasetBarChart.filter(d => d.group === group || d.group === 'All');

        const margin = { top: 20, right: 10, bottom: 20, left: 50 };
        const width = 350 - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

        const xScale = d3.scaleBand()
            .domain(filteredData.map(d => d.category))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        const svg = d3.select('#barChart svg g');

        svg.selectAll('text.title')
            .data([group])
            .join('text')
            .attr('x', (width + margin.left + margin.right) / 2)
            .attr('y', -margin.top / 2)
            .attr('class', 'title')
            .attr('text-anchor', 'middle')
            .text(`Category distribution for ${group}`);

        // Remove existing bars and labels before adding new ones
        svg.selectAll('.bar').remove();
        svg.selectAll('.label').remove();

        svg.selectAll('.bar')
            .data(filteredData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.category))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.value))
            .attr('fill', color);

        svg.selectAll('.label')
            .data(filteredData)
            .enter().append('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d.category) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.value) - 5)
            .attr('text-anchor', 'middle')
            .text(d => `${d.value}%`);
    });
}
