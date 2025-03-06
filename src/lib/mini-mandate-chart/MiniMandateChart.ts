import * as d3 from "d3";
import type { Simulation } from "$lib/types";
import {
    DeviceType,
    type MiniMandateChartOptions as ChartOptions,
    type MiniMandateChartData as ChartData
} from "./MiniMandateChartTypes";

export class MiniMandateChart {
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private options: ChartOptions;
    private data?: ChartData;
    private lastRawData?: Simulation;
    private mainScale?: d3.ScaleLinear<number, number>;
    private sideScaleFidesz?: d3.ScaleLinear<number, number>;
    private sideScaleTisza?: d3.ScaleLinear<number, number>;

    constructor(svgElement: SVGSVGElement, options: ChartOptions) {
        this.svg = d3.select(svgElement);
        this.options = options;
    }

    private setupScales() {
        const { width, height, margin, deviceType } = this.options;
        if (!this.data) return;

        const isHorizontal = this.isHorizontal(deviceType);

        this.mainScale = d3
            .scaleLinear()
            .domain([0, this.data.fidesz.length - 1])
            .range(isHorizontal ? [margin.left, width - margin.right] : [height - margin.bottom, margin.top]);

        this.sideScaleFidesz = d3
            .scaleLinear()
            .domain([0, this.data.maxUnified])
            .range(isHorizontal ? [height / 2, margin.top] : [width / 2, margin.left]);

        this.sideScaleTisza = d3
            .scaleLinear()
            .domain([0, this.data.maxUnified])
            .range(isHorizontal ? [height / 2, height - margin.bottom] : [width / 2, width - margin.right]);
    }

    private processData(data: Simulation): ChartData {
        // Return cached data if it's the same reference
        if (this.lastRawData === data && this.data) {
            return this.data;
        }

        if (!data['fidesz'] || !data['tisza']) {
            return {
                fidesz: [],
                tisza: [],
                medians: { fidesz: 0, tisza: 0 },
                maxUnified: 0
            };
        }
        // Process data
        const dataFidesz = data['fidesz'].map((d, i) => ({ x: i, y: d as number | null }));
        const dataTisza = data['tisza'].map((d, i) => ({ x: i, y: d as number | null }));

        // Set data to undefined if the value and adjacent values are all 0
        for (let i = 1; i < dataFidesz.length - 1; i++) {
            if (dataFidesz[i].y === 0 && dataFidesz[i - 1].y === 0 && dataFidesz[i + 1].y === 0) {
                dataFidesz[i].y = null;
            }
            if (dataTisza[i].y === 0 && dataTisza[i - 1].y === 0 && dataTisza[i + 1].y === 0) {
                dataTisza[i].y = null;
            }
        }

        const maxFidesz = d3.max(dataFidesz, (d) => d.y) || 0;
        const maxTisza = d3.max(dataTisza, (d) => d.y) || 0;

        this.lastRawData = data;
        return {
            fidesz: dataFidesz,
            tisza: dataTisza,
            medians: data.medians,
            maxUnified: Math.max(maxFidesz, maxTisza)
        };
    }

    draw(data: Simulation) {
        if (!data['fidesz']?.length || !data['tisza']?.length) {
            return;
        }

        this.data = this.processData(data);
        this.setupScales();
        this.render();
    }

    update(options: ChartOptions) {
        this.options = options;
        if (this.data) {
            this.setupScales();
            this.render();
        }
    }

    private render() {
        if (!this.data || !this.mainScale || !this.sideScaleFidesz || !this.sideScaleTisza) return;
        const { width, height, margin, deviceType } = this.options;
        const isHorizontal = this.isHorizontal(deviceType);

        this.svg.selectAll("*").remove();

        // Draw paths using more type-safe approach
        this.drawPath(this.data.tisza, 'tisza', "#00359c33", "#00359c");
        this.drawPath(this.data.fidesz, 'fidesz', "#fd810033", "#fd8100");

        // Draw median lines and labels
        this.drawMedianLine(this.data.medians.fidesz, this.sideScaleFidesz, this.mainScale, this.data.maxUnified, "#fd8100", isHorizontal);
        this.drawMedianLine(this.data.medians.tisza, this.sideScaleTisza, this.mainScale, this.data.maxUnified, "#00359c", isHorizontal);

        // Draw center line
        this.svg
            .append("line")
            .attr("x1", isHorizontal ? margin.left : width / 2)
            .attr("x2", isHorizontal ? width - margin.right : width / 2)
            .attr("y1", isHorizontal ? height / 2 : margin.top)
            .attr("y2", isHorizontal ? height / 2 : height - margin.bottom)
            .attr("stroke", "#333");

        // Draw majority markers
        this.drawMajorityMarker(100, this.mainScale, isHorizontal ? height : width, "Többség", isHorizontal);
        this.drawMajorityMarker(133, this.mainScale, isHorizontal ? height : width, "Kétharmad", isHorizontal);

        // Draw min and max values
        this.drawMinMaxValues(this.sideScaleFidesz, this.mainScale, isHorizontal);
    }

    private drawPath(data: { x: number; y: number | null }[], party: 'fidesz' | 'tisza', fillColor: string, strokeColor: string) {
        if (!this.mainScale || !this.sideScaleFidesz || !this.sideScaleTisza) return;

        const { deviceType } = this.options;
        const isHorizontal = this.isHorizontal(deviceType)
        const sideScale = party === 'fidesz' ? this.sideScaleFidesz : this.sideScaleTisza;

        // Only include points with valid y values
        const validData = data.filter(d => d.y !== null);
        if (validData.length === 0) return;

        // We'll use type assertion since we know these are valid at this point
        const mainScale = this.mainScale as d3.ScaleLinear<number, number>;
        const sideSc = sideScale as d3.ScaleLinear<number, number>;

        const line = d3.line<{ x: number; y: number | null }>()
            .defined(d => d.y !== null)
            .x(d => isHorizontal ? mainScale(d.x) : sideSc(d.y || 0))
            .y(d => isHorizontal ? sideSc(d.y || 0) : mainScale(d.x))
            .curve(d3.curveBasis);

        this.svg
            .append("path")
            .datum(validData)
            .attr("fill", fillColor)
            .attr("stroke", strokeColor)
            .attr("stroke-width", 1)
            .attr("d", line);
    }

    private drawMedianLine(median: number, sideScale: d3.ScaleLinear<number, number>, mainScale: d3.ScaleLinear<number, number>, maxUnified: number, color: string, isHorizontal: boolean) {
        const isFidesz = color === "#fd8100";
        const side = sideScale(0); // Always start from the center
        const side2 = isFidesz ? sideScale(maxUnified) - 10 : sideScale(maxUnified) + 10;
        const textSide = isFidesz ? sideScale(maxUnified) - 15 : sideScale(maxUnified) + 15;

        this.svg
            .append("line")
            .attr("x1", isHorizontal ? mainScale(median) : side)
            .attr("x2", isHorizontal ? mainScale(median) : side2)
            .attr("y1", isHorizontal ? side : mainScale(median))
            .attr("y2", isHorizontal ? side2 : mainScale(median))
            .attr("stroke", color)
            .attr("stroke-width", 3);

        this.svg
            .append("text")
            .attr("x", isHorizontal ? mainScale(median) : textSide)
            .attr("y", isHorizontal ? textSide : mainScale(median))
            .attr("text-anchor", isHorizontal ? "middle" : (isFidesz ? "end" : "start"))
            .attr("alignment-baseline", "middle")
            .style("font-size", "20px")
            .style("font-weight", 500)
            .style("fill", color)
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 2)
            .style("paint-order", "stroke")
            .text(`${median}`);
    }

    private drawMajorityMarker(value: number, mainScale: d3.ScaleLinear<number, number>, size: number, label: string, isHorizontal: boolean) {
        this.svg
            .append("line")
            .attr("x1", isHorizontal ? mainScale(value) : 0)
            .attr("x2", isHorizontal ? mainScale(value) : size)
            .attr("y1", isHorizontal ? 0 : mainScale(value))
            .attr("y2", isHorizontal ? size : mainScale(value))
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2")
            .lower();

        const horizontalTextY = (value === 133) ? 3 : (value === 100) ? 18 : size / 2;

        this.svg
            .append("text")
            .attr("x", isHorizontal ? mainScale(value) + 3 : size / 2)
            .attr("y", isHorizontal ? horizontalTextY : mainScale(value))
            .attr("text-anchor", isHorizontal ? "text-before-edge" : "middle")
            .attr("alignment-baseline", isHorizontal ? "text-before-edge" : "text-after-edge")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .style("stroke", "#f9f9f9")
            .style("stroke-width", 3)
            .style("paint-order", "stroke")
            .text(label);
    }

    private drawMinMaxValues(sideScale: d3.ScaleLinear<number, number>, mainScale: d3.ScaleLinear<number, number>, isHorizontal: boolean) {
        this.svg
            .append("text")
            .attr("x", isHorizontal ? mainScale(0) : sideScale(0) - 3)
            .attr("y", isHorizontal ? sideScale(0) - 3 : mainScale(0))
            .attr("text-anchor", isHorizontal ? "middle" : "end")
            .attr("alignment-baseline", isHorizontal ? "middle" : "text-after-edge")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .text("0");

        this.svg
            .append("text")
            .attr("x", isHorizontal ? mainScale(199) : sideScale(0) + 3)
            .attr("y", isHorizontal ? sideScale(0) + 3 : mainScale(199))
            .attr("text-anchor", isHorizontal ? "middle" : "start")
            .attr("alignment-baseline", isHorizontal ? "middle" : "text-before-edge")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .style("fill", "#333")
            .text("199");
    }

    private isHorizontal(deviceType: DeviceType) {
        return deviceType === DeviceType.Mobile || deviceType === DeviceType.Tablet;
    }
} 