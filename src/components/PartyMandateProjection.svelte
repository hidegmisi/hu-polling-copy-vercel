<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import type { Party } from "$lib/types";
    import { partyData } from "../stores/dataStore";

    export let party: Party;
    export let data: number[];
    export let median: number;

    let width = 450;
    let height = 150;
    
    let margin = { top: 40, right: 30, bottom: 5, left: 30 };
    
    let svg;

    onMount(() => {
        const selectedData = data;
        const svgSelection = d3.select(svg);

        // 1) Convert your data into two separate arrays of { x, y } objects:
        //    - Fidesz is index 0 in each pair
        //    - Tisza is index 1
        const partyMandatePoints = selectedData.map((d, i) => ({ x: i, y: d as number | null }));

        // set data to undefined if the value, and the values before and after are all 0
        for (let i = 1; i < selectedData.length - 1; i++) {
            if (selectedData[i] == 0 && selectedData[i - 1] == 0 && selectedData[i + 1] == 0) {
                partyMandatePoints[i].y = null;
            }
        }

        // 2) Create an x-scale from [0 .. selectedData.length-1] → [margin.left .. width-margin.right]
        const xScale = d3
        .scaleLinear()
        .domain([0, selectedData.length - 1])
        .range([margin.left, width - margin.right]);

        // 3) Determine max y-values so we can define separate y-scales for above/below
        const max = d3.max(partyMandatePoints, (d) => d.y) || 0;

        // 4) Create two y-scales:
        //    - Tisza (above center line) from 0..maxTisza => [height/2 .. margin.top]
        //      (the domain’s 0 is mapped to height/2, max is mapped near the top)
        //    - Fidesz (below center line) from 0..maxFidesz => [height/2 .. height - margin.bottom]
        //      (the domain’s 0 is mapped to height/2, max is mapped near the bottom)
        const yMidPoint = margin.top + (height - margin.bottom - margin.top) / 2;

        const yScale = d3
        .scaleLinear()
        .domain([0, 0.08])
        .range([yMidPoint, margin.top]);

        // 5) Line generator:
        const area = d3
        .area()
        .defined(d => d.y !== null)
        .x((d) => xScale(d.x))
        .y0(yMidPoint)
        .y1((d) => yScale(d.y))
        .curve(d3.curveMonotoneY);

        // 6) Append the area path
        svgSelection
        .append("path")
        .datum(partyMandatePoints)
        .attr("fill",  partyData[party].color + "33")
        .attr("stroke",  partyData[party].color)
        .attr("stroke-width", 1)
        .attr("d", area);
            
        // 7) Draw the vertical axis for median value
        
        svgSelection
            .append("line")
            .attr("x1", xScale(median))
            .attr("y1", yScale(0))
            .attr("x2", xScale(median))
            .attr("y2", yScale(max) - 10)
            .attr("stroke", partyData[party].color)
            .attr("stroke-width", 3)

        svgSelection
            .append("text")
            .attr("x", xScale(median))
            .attr("y", yScale(max) - 10)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "text-after-edge")
            .style("font-size", "20px")
            .style("font-weight", 500)
            .style("fill",  partyData[party].color)
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 2)
            .style("paint-order", "stroke")
            .text(`${median}`);

        // 9) Draw the horizontal axis in the center (y = height/2)

        /* svgSelection
            .append("g")
            .attr("class", "y-axis")
            .call(yAxis)
            .selectAll("text")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", "3px")
            .style("paint-order", "stroke")
            .style("font-size", "12px")
            .style("font-weight", 400); */

        // 10) Draw a center line for clarity
        svgSelection
            .append("line")
            .attr("y1", yMidPoint)
            .attr("y2", yMidPoint)
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
            .attr("stroke", "#333");

        // 11) Draw markers for majority and absolute majority

        svgSelection
            .append("line")
            .attr("y1", 0)
            .attr("y2", height)
            .attr("x1", xScale(5))
            .attr("x2", xScale(5))
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2")
            .lower();

        svgSelection
            .append("text")
            .attr("x", xScale(5))
            .attr("y", yMidPoint + 3)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "text-before-edge")
            .style("font-size", "10px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 5)
            .style("paint-order", "stroke")
            .text("bejutás");

        svgSelection
            .append("line")
            .attr("y1", 0)
            .attr("y2", height)
            .attr("x1", xScale(100))
            .attr("x2", xScale(100))
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2")
            .lower();

        svgSelection
            .append("text")
            .attr("x", xScale(100))
            .attr("y", yMidPoint + 3)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "text-before-edge")
            .style("font-size", "10px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 5)
            .style("paint-order", "stroke")
            .text("többség");

        svgSelection
            .append("line")
            .attr("y1", 0)
            .attr("y2", height)
            .attr("x1", xScale(133))
            .attr("x2", xScale(133))
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2")
            .lower();

        svgSelection
            .append("text")
            .attr("x", xScale(133))
            .attr("y", yMidPoint + 3)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "text-before-edge")
            .style("font-size", "10px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 5)
            .style("paint-order", "stroke")
            .text("kétharmad");

        // 12) Add min and max values

        svgSelection
            .append("text")
            .attr("x", xScale(0) - 3)
            .attr("y", yScale(0))
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .style("font-size", "10px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .text("0");
       
        svgSelection
            .append("text")
            .attr("x", xScale(199) + 3)
            .attr("y", yScale(0))
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "middle")
            .style("font-size", "10px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .text("199");
    });    
</script>

<article id="mandate-visualization">
    <svg bind:this={svg} viewBox={`0 0 ${width} ${height}`}></svg>
</article>

<style lang="scss">
#mandate-visualization {
    width: 100%;
    aspect-ratio: 4 / 2;
    max-height: 150px;
}
</style>