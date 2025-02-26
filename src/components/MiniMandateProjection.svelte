<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";

    let data = {
        'proba': [
            [0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.02, 0.0],[0.02, 0.0],[0.02, 0.0],[0.02, 0.0],[0.03, 0.0],[0.03, 0.0],[0.03, 0.0],[0.03, 0.0],[0.04, 0.0],[0.04, 0.0],[0.04, 0.0],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.02],[0.03, 0.02],[0.03, 0.02],[0.03, 0.02],[0.03, 0.03],[0.02, 0.03],[0.02, 0.03],[0.02, 0.03],[0.02, 0.04],[0.01, 0.04],[0.01, 0.04],[0.01, 0.04],[0.01, 0.04],[0.01, 0.04],[0.01, 0.04],[0.01, 0.04],[0.0, 0.04],[0.0, 0.04],[0.0, 0.04],[0.0, 0.03],[0.0, 0.03],[0.0, 0.03],[0.0, 0.03],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],
        ],
        'proba2': [
            [0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.01, 0.0],[0.02, 0.0],[0.02, 0.0],[0.02, 0.0],[0.02, 0.0],[0.03, 0.01],[0.03, 0.01],[0.03, 0.01],[0.03, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.01],[0.04, 0.02],[0.04, 0.02],[0.04, 0.02],[0.04, 0.02],[0.03, 0.02],[0.03, 0.02],[0.03, 0.02],[0.03, 0.02],[0.02, 0.02],[0.02, 0.02],[0.02, 0.02],[0.02, 0.03],[0.01, 0.03],[0.01, 0.03],[0.01, 0.03],[0.01, 0.03],[0.01, 0.03],[0.01, 0.03],[0.01, 0.03],[0.0, 0.03],[0.0, 0.03],[0.0, 0.03],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.02],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.01],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],[0.0, 0.0],
        ],
    }

    let medianFidesz = 83;
    let medianTisza = 101;

    let width = 250;
    let height = 180;
    
    let margin = { top: 20, right: 70, bottom: 50, left: 70 };
    
    width = 250;
    height = 330;
    
    let svg; // We'll bind <svg> to this variable.

    onMount(() => {
        const selectedData = data['proba2'];
        const svgSelection = d3.select(svg);

        // 1) Convert your data into two separate arrays of { x, y } objects:
        //    - Fidesz is index 0 in each pair
        //    - Tisza is index 1
        const dataFidesz = selectedData.map((d, i) => ({ x: i, y: d[0] }));
        const dataTisza = selectedData.map((d, i) => ({ x: i, y: d[1] }));

        // set data to undefined if the value, and the values before and after are all 0
        for (let i = 1; i < selectedData.length - 1; i++) {
            if (selectedData[i][0] == 0 && selectedData[i - 1][0] == 0 && selectedData[i + 1][0] == 0) {
                dataFidesz[i].y = null;
            }
            if (selectedData[i][1] == 0 && selectedData[i - 1][1] == 0 && selectedData[i + 1][1] == 0) {
                dataTisza[i].y = null;
            }
        }

        // 2) Create an x-scale from [0 .. selectedData.length-1] → [margin.left .. width-margin.right]
        const yScale = d3
        .scaleLinear()
        .domain([0, selectedData.length - 1])
        .range([height - margin.bottom, margin.top]);

        // 3) Determine max y-values so we can define separate y-scales for above/below
        const maxFidesz = d3.max(dataFidesz, (d) => d.y) || 0;
        const maxTisza = d3.max(dataTisza, (d) => d.y) || 0;
        const maxUnified = Math.max(maxFidesz, maxTisza);

        // 4) Create two y-scales:
        //    - Tisza (above center line) from 0..maxTisza => [height/2 .. margin.top]
        //      (the domain’s 0 is mapped to height/2, max is mapped near the top)
        //    - Fidesz (below center line) from 0..maxFidesz => [height/2 .. height - margin.bottom]
        //      (the domain’s 0 is mapped to height/2, max is mapped near the bottom)
        const xScaleFidesz = d3
        .scaleLinear()
        .domain([0, maxUnified])
        .range([width / 2, margin.left]);

        const xScaleTisza = d3
        .scaleLinear()
        .domain([0, maxUnified])
        .range([width / 2, width - margin.right]);

        // 5) Line generators:
        //    - Tisza (above the center line)
        const lineTisza = d3
        .line()
        .defined(d => d.y !== null)
        .y((d) => yScale(d.x))
        .x((d) => xScaleTisza(d.y))
        .curve(d3.curveBasis);

        //    - Fidesz (below the center line)
        const lineFidesz = d3
        .line()
        .defined(d => d.y !== null)
        .y((d) => yScale(d.x))
        .x((d) => xScaleFidesz(d.y))
        .curve(d3.curveBasis);

        // 6) Append the Tisza path
        svgSelection
        .append("path")
        .datum(dataTisza)
        .attr("fill", "#00359c33")
        .attr("stroke", "#00359c")
        .attr("stroke-width", 1)
        .attr("d", lineTisza);

        // 7) Append the Fidesz path
        svgSelection
        .append("path")
        .datum(dataFidesz)
        .attr("fill", "#fd810033")
        .attr("stroke", "#fd8100")
        .attr("stroke-width", 1)
        .attr("d", lineFidesz);
            
        // 8) Draw the vertical axis for "median" values
        
        svgSelection
            .append("line")
            .attr("y1", yScale(medianFidesz))
            .attr("x1", xScaleFidesz(0))
            .attr("y2", yScale(medianFidesz))
            .attr("x2", xScaleFidesz(maxUnified) - 10)
            .attr("stroke", "#fd8100")
            .attr("stroke-width", 3)

        svgSelection
            .append("text")
            .attr("y", yScale(medianFidesz))
            .attr("x", xScaleFidesz(maxUnified) - 15)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style("font-weight", 500)
            .style("fill", "#fd8100")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 2)
            .style("paint-order", "stroke")
            .text(`${medianFidesz}`);
        
        svgSelection
            .append("line")
            .attr("y1", yScale(medianTisza))
            .attr("x1", xScaleTisza(0))
            .attr("y2", yScale(medianTisza))
            .attr("x2", xScaleTisza(maxUnified) + 10)
            .attr("stroke", "#00359c")
            .attr("stroke-width", 3)

        svgSelection
            .append("text")
            .attr("y", yScale(medianTisza))
            .attr("x", xScaleTisza(maxUnified) + 15)
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style("font-weight", 500)
            .style("fill", "#00359c")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 2)
            .style("paint-order", "stroke")
            .text(`${medianTisza}`);

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
            .attr("x1", width / 2)
            .attr("x2", width / 2)
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom)
            .attr("stroke", "#333");

        // 11) Draw markers for majority and absolute majority

        svgSelection
            .append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(100))
            .attr("y2", yScale(100))
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2")
            //send to back
            .lower();

        svgSelection
            .append("text")
            .attr("y", yScale(100))
            .attr("x", width / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "text-after-edge")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 3)
            .style("paint-order", "stroke")
            .text("Többség");

        svgSelection
            .append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(133))
            .attr("y2", yScale(133))
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2")
            .lower();

        svgSelection
            .append("text")
            .attr("y", yScale(133))
            .attr("x", width / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "text-after-edge")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 3)
            .style("paint-order", "stroke")
            .text("Kétharmad");

        // 12) Add min and max values

        svgSelection
            .append("text")
            .attr("y", yScale(0))
            .attr("x", xScaleFidesz(0) - 3)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", " text-after-edge")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .text("0");
       
        svgSelection
            .append("text")
            .attr("y", yScale(199))
            .attr("x", xScaleFidesz(0) + 3)
            .attr("text-anchor", "start")
            .attr("alignment-baseline", " text-before-edge")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .text("199");
    });    
</script>

<article id="mandate-visualization">
    <svg bind:this={svg} viewBox={`0 0 ${width} ${height}`}></svg>
    <div class="chartInfos">
        <img src="/images/candidate/fidesz.png" alt="Fidesz" class="fidesz" />
        <div class="textContainer">
            <h2 id="leaderText">Prognózis:</h2>
            <div class="standing">
                Tisza többség
            </div>
        </div>
        <img src="/images/candidate/tisza.png" alt="Tisza" class="tisza" />
    </div>
</article>

<style lang="scss">
.chartInfos {
    position: relative;
    max-width: 250px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -32px;
    padding: 6px;
    border-radius: 120px;
    background-color: #f5f5f5;
    border: 1px solid #eee;
    z-index: 2;

    img {
        width: 36px;
        height: 36px;
        border-radius: 50%;

        &.tisza {
            background-color: #00359c66;
        }
        &.fidesz {
            background-color: #fd810066;
        }
    }

    .textContainer {
        align-items: center;
        padding: 0 8px;
        
        h2#leaderText {
            font-size: 0.9rem;
            font-weight: 600;
            padding: 2px 3px;
            padding-bottom: 0;
        }
        .standing {
            font-size: 0.75rem;
            text-align: center;

            span {
                background: none;
                padding: 0;
            }
        }
    }

}
svg {
    background-color: #f9f9f9;
    border: 2px solid #f5f5f5;
}
</style>