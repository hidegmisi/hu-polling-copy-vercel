import * as d3 from "d3";
import type { DayData, AxisParams, Party, PollData, Annotation } from "../types";
import { partyData } from "../../stores/dataStore";

interface ChartContext {
    x: d3.ScaleTime<number, number>;
    y: d3.ScaleLinear<number, number>;
    width: number;
    height: number;
}

let containerSizes = {
    small: 250,
    medium: 400,
    large: Infinity,
};

let paddingSizes = {
    small: 120,
    medium: 120,
    large: 120,
};

let paddingLeftSizes = {
    small: 30,
    medium: 30,
    large: 40,
}

let partyLabelSizes = {
    small: 9,
    medium: 11,
    large: 14,
}

let dotSizes = {
    month: {
        small: 2.5,
        medium: 3,
        large: 3.5,
    },
    quarter: {
        small: 1.5,
        medium: 1.5,
        large: 3,
    },
    year: {
        small: 1,
        medium: 1.5,
        large: 2,
    }
}

let lineWidths = {
    small: 1.5,
    medium: 1.8,
    large: 2.5,
}

let gridLabelSizes = {
    small: 7,
    medium: 12,
    large: 13,
}

let verticalLineLabelSizes = {
    small: 10,
    medium: 11,
    large: 12,
}

export class ChartRenderer {
    private static instanceCounter = 0;
    private clipPathId: string;

    private renderOptions: Record<string, unknown> = {
        showDots: true,
        isInteractive: true,
        aspectRatio: 7 / 4,
        yLims: undefined,
    };

    private margin = { top: 24, right: paddingSizes['small'], bottom: 34, left: paddingSizes['small'] }

    private containerElement: HTMLElement;
    private containerSizeCategory: keyof typeof containerSizes;
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    private gridGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    private annotationGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    private dataGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    private interactionGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    private hoverLine: d3.Selection<SVGLineElement, unknown, null, undefined>;
    private tooltipGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    private mouseEventRect: d3.Selection<SVGRectElement, unknown, null, undefined>;
    private svgDefs: d3.Selection<SVGDefsElement, unknown, null, undefined>;

    private context: ChartContext;
    private pollData: PollData;
    private dailyData: DayData[];
    private selectedParties: Party[];
    private annotations: Annotation[];
    private axisParams: AxisParams;

    constructor(containerElement: HTMLElement) {
        this.containerSizeCategory = "large";
        this.containerElement = containerElement;

        d3.select(containerElement).selectAll("*").remove();

        this.clipPathId = `future-clip-${ChartRenderer.instanceCounter++}`;

        this.svg = d3.select(containerElement).append("svg");
        this.chartGroup = this.svg.append("g").attr("class", "chart-group");
        this.gridGroup = this.chartGroup.append("g").attr("class", "grid-group");
        this.annotationGroup = this.chartGroup.append("g").attr("class", "annotation-group");
        this.dataGroup = this.chartGroup.append("g").attr("class", "data-group");

        this.interactionGroup = this.chartGroup.append("g").attr("class", "interaction-group");
        this.hoverLine = this.interactionGroup.append("line").attr("class", "hover-line");
        this.tooltipGroup = this.interactionGroup.append("g").attr("class", "tooltip-group");
        this.mouseEventRect = this.interactionGroup.append("rect").attr("class", "interaction-overlay");
        this.svgDefs = this.svg.append("defs");

        this.pollData = [];
        this.dailyData = [];
        this.selectedParties = [];
        this.annotations = [];
        this.axisParams = {
            xTickLevel: "year",
            yLims: [0, 1],
            ticks: [0, 0.25, 0.5, 0.75],
            dateRange: { start: new Date(2018, 0, 1), end: new Date() },
        };

        this.context = {
            x: d3.scaleTime(),
            y: d3.scaleLinear(),
            width: 0,
            height: 0,
        };
    }

    private getContainerSizeCategory() {
        const width = this.containerElement.offsetWidth;

        for (const [category, size] of Object.entries(containerSizes)) {
            if (width <= size) {
                return category as keyof typeof containerSizes;
            }
        }
        return "large";
    }

    public render(
        selectedParties: Party[],
        annotations: Annotation[],
        renderOptions: Record<string, unknown> | undefined,
        dateRange?: { start: Date, end: Date },
    ) {
        this.selectedParties = selectedParties;
        this.annotations = annotations;

        if (dateRange) {
            this.axisParams.dateRange = dateRange;
        }

        if (renderOptions) this.renderOptions = { ...this.renderOptions, ...renderOptions };

        this.containerSizeCategory = this.getContainerSizeCategory();

        this.margin.left = paddingLeftSizes[this.containerSizeCategory]
        this.margin.right = paddingSizes[this.containerSizeCategory]

        this.setupChart();
        this.drawGridlines();
        this.drawAnnotations();
        if (this.dailyData.length > 0) {
            this.updateData(this.pollData, this.dailyData, this.selectedParties);
            if (this.renderOptions.isInteractive) {
                this.setupInteractivity();
            }
        }
    }

    public updateData(pollData: PollData, dailyData: DayData[], selectedParties: Party[]) {
        this.pollData = pollData;
        this.dailyData = dailyData;
        this.selectedParties = selectedParties;

        const availableWidth = this.context.width - this.margin.right;
        const lastDataPointX = this.context.x(this.dailyData[this.dailyData.length - 1].date);

        if (lastDataPointX + this.margin.right < availableWidth) {
            this.margin.right = paddingLeftSizes[this.containerSizeCategory];
        } else {
            this.margin.right = lastDataPointX + this.margin.right - availableWidth;
        }

        this.context.x.range([this.margin.left, this.context.width - this.margin.right]);
        this.drawGridlines();

        this.drawData();

        if (this.renderOptions.isInteractive) {
            this.setupInteractivity();
        }
    }

    public updateAnnotations(annotations: Annotation[]) {
        this.annotations = annotations;
        this.annotationGroup.selectAll("*").remove();
        this.drawAnnotations();
    }

    public updateAxisLimits(newAxisParams: AxisParams) {
        this.axisParams = newAxisParams;
        this.context.x.domain([newAxisParams.dateRange.start, newAxisParams.dateRange.end]);
        this.context.y.domain(newAxisParams.yLims);

        this.drawGridlines();
        this.updateData(this.pollData, this.dailyData, this.selectedParties);
        this.updateAnnotations(this.annotations);
    }

    private setupChart() {
        const { containerSizeCategory, axisParams } = this;

        const width = this.containerElement.getBoundingClientRect().width;
        const height = width / (this.renderOptions.aspectRatio as number);

        this.context = {
            x: d3.scaleTime()
                .domain([axisParams.dateRange.start, axisParams.dateRange.end])
                .range([this.margin.left, width - this.margin.right]),
            y: d3.scaleLinear()
                .domain(axisParams.yLims)
                .range([height - this.margin.bottom, this.margin.top]),
            width,
            height,
        };

        this.svg
            .attr("viewBox", `0 0 ${this.containerElement.getBoundingClientRect().width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");
    }

    private drawGridlines() {
        const { x, y, width, height } = this.context;
        const { axisParams, containerSizeCategory } = this;

        this.gridGroup.selectAll("*").remove();

        const xTicks = axisParams.xTickLevel === "year"
            ? d3.timeYear.every(1)
            : axisParams.xTickLevel === "quarter"
                ? d3.timeMonth.every(3)
                : d3.timeMonth.every(1);

        const dateFormatOptions: Intl.DateTimeFormatOptions = axisParams.xTickLevel === "year"
            ? { year: "numeric" }
            : { month: "short" };

        const xGridSelection = this.gridGroup.selectAll("g.x-grid").data([null]);
        xGridSelection.join(
            enter => {
                const g = enter.append("g")
                    .attr("class", "grid x-grid")
                    .attr("transform", `translate(0,${height - this.margin.bottom})`);
                g.call(
                    d3.axisBottom(x)
                        .ticks(xTicks)
                        .tickSizeInner(6)
                        .tickPadding(8)
                        .tickFormat((d) => {
                            if (axisParams.xTickLevel === 'quarter' && new Date(d).getMonth() === 0) {
                                return new Date(d).toLocaleDateString("hu-HU", { year: "numeric" }).replace(".", "");
                            } else {
                                return new Date(d).toLocaleDateString("hu-HU", dateFormatOptions).replace(".", "");
                            }
                        })
                );

                // transform the labels by half the tick size if the xTickLevel is year
                if (axisParams.xTickLevel === "year") {
                    const tickSpacing = (width - this.margin.left - this.margin.right) / (this.context.x.ticks(xTicks).length - 1);
                    g.selectAll("text")
                        .attr("transform", `translate(${tickSpacing / 2}, 0)`)
                        .attr("dy", "6px")
                        .attr("text-anchor", "middle");
                }

                g.select(".domain").remove();
                g.selectAll("line")
                    .style("stroke", "#ddd")
                    .style("stroke-opacity", 1);
                g.selectAll("text")
                    .style("white-space", "pre-wrap");
                return g;
            },
            update => {
                update.attr("transform", `translate(${this.margin.top},${height - this.margin.bottom})`)
                    .call(
                        d3.axisBottom(x)
                            .ticks(xTicks)
                            .tickSizeInner(6)
                            .tickPadding(8)
                            .tickFormat((d) => {
                                if (axisParams.xTickLevel === 'quarter' && new Date(d).getMonth() === 0) {
                                    return new Date(d).toLocaleDateString("hu-HU", { year: "numeric" }).replace(".", "");
                                } else {
                                    return new Date(d).toLocaleDateString("hu-HU", dateFormatOptions).replace(".", "");
                                }
                            })
                    );
                update.select(".domain").remove();
                update.selectAll("line")
                    .style("stroke", "#ddd")
                    .style("stroke-opacity", 1)
                update.selectAll("text")
                    .style("white-space", "pre-wrap");
                return update;
            }
        );

        const leftGridWidth = this.renderOptions.isInteractive
            ? width - this.margin.right
            : width - paddingLeftSizes[this.containerSizeCategory];
            
        const yLeftGridSelection = this.gridGroup.selectAll("g.y-grid-left").data([null]);
        yLeftGridSelection.join(
            enter => {
                const g = enter.append("g")
                    .attr("class", "grid y-grid y-grid-left");
                g.call(
                    d3.axisLeft(y)
                        .tickValues(axisParams.ticks)
                        .tickSize(-leftGridWidth)
                        .tickFormat((d) => `${Math.round(d * 100)}`)
                        .tickPadding(-15)
                );
                g.select(".domain").remove();
                g.selectAll("line")
                    .style("stroke", "#ddd")
                    .style("stroke-opacity", 1);
                g.style("border-bottom", "1px solid #ddd");
                return g;
            },
            update => {
                update.call(
                    d3.axisLeft(y)
                        .tickValues(axisParams.ticks)
                        .tickSize(-leftGridWidth)
                        .tickFormat((d) => `${Math.round(d * 100)}`)
                        .tickPadding(-15)
                );
                update.select(".domain").remove();
                update.selectAll("line")
                    .style("stroke", "#ddd")
                    .style("stroke-opacity", 1);
                return update;
            }
        );

        if (this.renderOptions.isInteractive) {
            this.gridGroup
                .append("g")
                .attr("class", "grid y-grid-right")
                .call(
                    d3
                        .axisRight(y)
                        .tickValues(this.axisParams.ticks)
                        .tickSize(-this.margin.right)
                        .tickFormat(null)
                )
                .call((g) => g.select(".domain").remove())
                .selectAll("line")
                .attr("class", "y-gridline-right")
                .style("stroke", "#efefef")
                .attr("transform", `translate(${width}, 0)`);

        }
        this.gridGroup
            .selectAll(".y-grid-right")
            .selectAll("text")
            .remove();

        this.gridGroup
            .selectAll(".y-grid")
            .selectAll("text")
            .attr("dx", this.containerSizeCategory == "small" ? "2px" : "6px")
            .attr("dy", this.containerSizeCategory == "small" ? "-2px" : "-6px")

        d3.selectAll(".grid text").style("font-size", gridLabelSizes[this.containerSizeCategory]).attr("fill", "#666");
    }

    private drawAnnotations() {
        const { x, height } = this.context;

        this.annotationGroup.selectAll("*").remove();

        this.annotations.forEach(annotation => {
            const lineX = x(annotation.date);

            this.annotationGroup
                .append("line")
                .attr("class", "vertical-line")
                .attr("x1", lineX)
                .attr("x2", lineX)
                .attr("y1", this.margin.top)
                .attr("y2", height - this.margin.bottom)
                .attr("stroke", '#999')
                .attr("opacity", 1)
                .attr("stroke-width", 0.75);

            this.annotationGroup
                .append("text")
                .attr("class", "vertical-line-label")
                .attr("id", annotation.id + "-label")
                .attr("x", lineX)
                .attr("y", this.margin.top - 4)
                .attr("transform", `rotate(-90, ${lineX}, ${this.margin.top})`)
                .attr("text-anchor", "end")
                .attr("fill", "#aaa")
                .attr("stroke", "#f9f9f9")
                .attr("stroke-width", 4)
                .attr("paint-order", "stroke")
                .attr("font-size", `${verticalLineLabelSizes[this.containerSizeCategory]}px`)
                .style("font-weight", "400")
                .text(annotation.text)
        });
    }

    private drawData() {
        for (const party of this.selectedParties) {
            this.drawPollDots(party);
            this.drawTrendLine(party);
            this.dataGroup.selectAll('.foreground').attr("clip-path", `url(#${this.clipPathId})`);
        }
    }

    private drawTrendLine(party: Party) {
        const { x, y } = this.context;

        const line = d3.line<DayData>()
            .x((d) => x(d.date))
            .y((d) => y(d[party] as number))
            .curve(d3.curveMonotoneX);

        const lineData = this.dailyData.filter(d => d[party] !== undefined);

        this.dataGroup
            .selectAll(`.${party}-trend-line`)
            .data([lineData])
            .join(
                enter => enter.append("path")
                    .attr("class", `${party}-trend-line`)
                    .attr("clip-path", `url(#${this.clipPathId})`)
                    .attr("fill", "none")
                    .attr("stroke", partyData[party].color)
                    .attr("stroke-width", lineWidths[this.containerSizeCategory])
                    .attr("opacity", 1)
                    .attr("d", line),

                update => update
                    .attr("clip-path", `url(#${this.clipPathId})`)
                    .transition().duration(500)
                    .attr("d", line),

                exit => exit.remove()
            );

        this.dataGroup
            .selectAll(`.${party}-foreground-line`)
            .data([lineData])
            .join(
                enter => enter.append("path")
                    .attr("class", `${party}-foreground-line`)
                    .attr("fill", "none")
                    .attr("stroke", partyData[party].color)
                    .attr("stroke-width", lineWidths[this.containerSizeCategory] * 6)
                    .attr("stroke-linecap", "round")
                    .attr("opacity", 0.07)
                    .attr("d", line),

                update => update.transition().duration(500).attr("d", line),

                exit => exit.remove()
            );
    }

    private drawPollDots(party: Party) {
        const { x, y } = this.context;

        const pollDots = this.dataGroup
            .selectAll(`.${party}-dot`)
            .data(
                this.pollData
                    .filter(d => d[party] !== undefined && d[party] !== null && d[party] > 0.01),
                (d) => d.date.getTime() // Use date as a unique key for better data binding
            );

        pollDots
            .join(
                enter => enter.append("circle")
                    .attr("class", party + "-dot")
                    .attr("cx", (d) => x(d.date))
                    .attr("cy", (d) => y(d[party] as number))
                    .attr("r", dotSizes[this.axisParams.xTickLevel][this.containerSizeCategory])
                    .attr("opacity", 0)
                    .attr("fill", partyData[party].color)
                    .call(enter => enter.transition().duration(500).attr("opacity", 0.15)),

                update => update
                    .transition().duration(500)
                    .attr("opacity", 0.12) // Necessary
                    .attr("r", dotSizes[this.axisParams.xTickLevel][this.containerSizeCategory]) // Necessary
                    .attr("cx", (d) => x(d.date))
                    .attr("cy", (d) => y(d[party] as number)),

                exit => exit
                    .transition().duration(500).attr("opacity", 0)
                    .remove()
            );
    }

    private setupInteractivity() {
        const { x, y, width, height } = this.context;

        this.hoverLine
            .attr("stroke", "#000")
            .attr("stroke-width", 0.75)
            .attr("y1", this.margin.top)
            .attr("y2", height - this.margin.bottom)
            .attr("opacity", 0);

        this.mouseEventRect
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mousemove", (event) => this.handleMouseMove(event))
            .on("mouseout", () => this.updateTooltips(this.dailyData[this.dailyData.length - 1]));


        let clipPathSelection = this.svgDefs.selectAll(`#${this.clipPathId}`).data([null]);
        clipPathSelection.join(
            enter => {
                const clipPath = enter.append("clipPath")
                    .attr("id", this.clipPathId)
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", x(new Date()))
                    .attr("height", height);
                return clipPath;
            },
            update => {
                update.select("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", x(new Date()))
                    .attr("height", height);
                return update;
            }
        );

        this.updateTooltips(this.dailyData[this.dailyData.length - 1]);
    }

    private handleMouseMove(event: MouseEvent) {
        const { x } = this.context;

        const [mouseX] = d3.pointer(event, this.svg.node());
        const hoveredDate = x.invert(mouseX);

        // Find the closest data point for each party
        const closestData = this.dailyData.map((day) => ({
            date: day.date,
            ...this.selectedParties.reduce((acc, party) => {
                if (day[party] !== undefined && day[party] !== null) {
                    acc[party] = day[party];
                }
                return acc;
            }, {} as Record<Party, number>),
        }));

        const nearestData = closestData.reduce((prev, curr) => {
            const prevDiff = Math.abs(prev.date.getTime() - hoveredDate.getTime());
            const currDiff = Math.abs(curr.date.getTime() - hoveredDate.getTime());
            return currDiff < prevDiff ? curr : prev;
        });

        this.updateTooltips(nearestData ?? this.dailyData[this.dailyData.length - 1]);
    }

    private updateTooltips(data: DayData) {
        const { x, height } = this.context;
        this.tooltipGroup.selectAll("*").remove();

        this.hoverLine
            .attr("x1", x(data.date))
            .attr("x2", x(data.date))
            .attr("opacity", 1);

        const dateInCurrentYear = new Date().getFullYear() === data.date.getFullYear();

        const dateLabel = this.tooltipGroup.append("text")
            .attr("x", x(data.date))
            .attr("y", -6 + this.margin.top)
            .attr("text-anchor", "middle")
            .attr("fill", "#222")
            .attr("font-size", `${gridLabelSizes[this.containerSizeCategory]}px`)
            .style("font-weight", "400")
            .text(
                new Date(data.date).toLocaleDateString("hu-HU", {
                    year: dateInCurrentYear ? undefined : "numeric",
                    month: dateInCurrentYear ? "long" : "short",
                    day: "numeric",
                }),
            );

        this.handleTooltipOverlaps(data)

        const clipRect = this.svg.select("#" + this.clipPathId + " rect");
        clipRect
            .attr("x", 0)
            .attr("width", x(data.date))
            .attr("height", height);
    }

    private handleTooltipOverlaps(data: DayData) {
        const { x, y } = this.context;

        const tooltipPositions: { party: Party; x: number; y: number; value: number }[] = [];

        this.selectedParties.forEach((party) => {
            if (data[party] !== undefined) {
                tooltipPositions.push({
                    party,
                    x: x(data.date),
                    y: y(data[party] as number),
                    value: data[party] as number,
                });
            }
        });

        tooltipPositions.sort((a, b) => b.y - a.y);

        const adjustedPositions: { x: number; y: number; oldY: number; text: string, color: string }[] = [];
        const minDistance = partyLabelSizes[this.containerSizeCategory] + 1;

        tooltipPositions.forEach((tooltip, i) => {
            let newY = tooltip.y;

            if (i > 0) {
                const prev = adjustedPositions[i - 1];
                if (Math.abs(prev.y - newY) < minDistance) {
                    newY = prev.y - minDistance;
                }
            }

            adjustedPositions.push({
                x: tooltip.x,
                y: newY,
                oldY: tooltip.y,
                text: `${partyData[tooltip.party].name} ${(tooltip.value * 100).toFixed(0)}`,
                color: partyData[tooltip.party].color,
            });
        });

        // Render adjusted tooltips
        adjustedPositions.forEach((tooltip) => {
            this.tooltipGroup.append("circle")
                .attr("cx", tooltip.x + 8)
                .attr("cy", tooltip.y)
                .attr("r", Math.max(dotSizes[this.axisParams.xTickLevel][this.containerSizeCategory] * 1.8, 4))
                .attr("fill", tooltip.color)
                .attr("stroke", "#f9f9f9")
                .attr("stroke-width", 1);

            this.tooltipGroup.append("text")
                .attr("x", tooltip.x + 16)
                .attr("y", tooltip.y + 1)
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "middle")
                .attr("stroke", "#f9f9f9")
                .attr("stroke-width", 2)
                .style("font-size", partyLabelSizes[this.containerSizeCategory])
                .style("font-weight", 400)
                .attr("paint-order", "stroke")
                .attr("fill", tooltip.color)
                .text(tooltip.text);
        });

        // connect adjusted positions with lines
        adjustedPositions.forEach((tooltip) => {
            if (Math.abs(tooltip.oldY - tooltip.y) > 0) {
                this.tooltipGroup.append("line")
                    .attr("x1", tooltip.x)
                    .attr("x2", tooltip.x + 8)
                    .attr("y1", tooltip.oldY)
                    .attr("y2", tooltip.y)
                    .attr("stroke", tooltip.color)
                    .attr("stroke-width", 1)
                    .attr("linecap", "round")
                    .lower();
            }
        });
    }
}