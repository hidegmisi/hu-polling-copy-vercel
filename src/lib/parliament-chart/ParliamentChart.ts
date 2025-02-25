import * as d3 from 'd3';

interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface ParliamentChartOptions {
    width?: number;
    height?: number;
    margin?: Margin;
    seatRadius?: number;
    seatPadding?: number;
    outerRadius?: number;
    center?: [number, number];
}

export interface Party {
    seats: number;
    color: string;
    name: string;
}

interface Seat {
    x: number;
    y: number;
    row: number;
    angle: number;
    bin?: number;
    party?: Party;
}

interface SeatRow {
    rowIndex: number;
    seatsInRow: number;
    rowSeats: Seat[];
}

export default class ParliamentChart {
    private width: number;
    private height: number;
    private margin: Margin;
    private chartWidth: number;
    private chartHeight: number;
    private seatRadius: number;
    private seatPadding: number;
    private spacing: number;
    private arcAngle: number;
    private innerRadius: number;
    private outerRadius: number;
    private center: [number, number];
    private container: d3.Selection<HTMLElement, unknown, null, undefined>;
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>;

    constructor(selector: string | HTMLElement, options: ParliamentChartOptions = {}) {
        // Set overall dimensions and margins.
        this.width = options.width ?? 600;
        this.height = options.height ?? 400;
        this.margin = options.margin ?? { top: 20, right: 20, bottom: 20, left: 20 };

        // Compute the drawing area.
        this.chartWidth = this.width - this.margin.left - this.margin.right;
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;

        // Seat parameters.
        this.seatRadius = options.seatRadius ?? 10;
        this.seatPadding = options.seatPadding ?? 4;
        // Total space per seat (diameter plus padding)
        this.spacing = 2 * this.seatRadius + this.seatPadding;

        // We use a semicircular arc (π radians).
        this.arcAngle = Math.PI;

        // Inner and outer radii for the seating layout.
        this.innerRadius = 0;

        // Compute an outer radius that keeps the chart within bounds.
        this.outerRadius = options.outerRadius ?? Math.min(
            this.chartWidth / 2 - this.seatRadius,
            this.chartHeight - this.seatRadius
        );

        // Define the center of the arc: bottom-center of the drawing area.
        this.center = options.center ?? [this.chartWidth / 2, this.chartHeight];

        // Create the SVG container with a viewBox for scaling.
        this.container = typeof selector === 'string' ? d3.select(selector) : d3.select(selector);
        this.svg = this.container.append('svg')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');
        this.chartGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    }

    /**
     * Renders the parliament chart using party data.
     *
     * Each Party should have:
     *  - seats: number (number of seats for the party)
     *  - color: string (e.g., "red" or "#ff0000")
     *  - name: string (not used for now)
     *
     * The algorithm is:
     *
     * 1. Compute seat positions row-by-row using the original method.
     * 2. Flatten all seats into a single list.
     * 3. For each seat, compute a bin solely based on its angle.
     *    (Mapping: angle π (leftmost) → bin 0, angle 0 (rightmost) → bin (globalBins - 1)).
     * 4. Sort the seats by bin (and by row for ties) to yield a column-by-column order.
     * 5. Assign party data sequentially to these sorted seats.
     * 6. Illustrate the angular bins by drawing radial lines from the center every 10°.
     * 7. Render seats at their computed (x,y) positions.
     *
     * @param parties - Array of Party objects.
     */
    public update(parties: Party[]): void {
        // Calculate total seats.
        const totalSeats = parties.reduce((sum, party) => sum + party.seats, 0);

        // Build the seating layout row-by-row (from outer to inner).
        let seatMatrix: SeatRow[] = [];
        let seatsRemaining = totalSeats;
        let rowIndex = 0;
        
        while (seatsRemaining > 0) {
            const r = this.outerRadius - rowIndex * this.spacing;
            this.innerRadius = r;

            if (r < this.seatRadius) break;

            // Maximum possible seats in this row.
            const theoreticalCapacity = Math.floor((this.arcAngle * r) / this.spacing);
            if (theoreticalCapacity <= 0) break;

            const seatsInRow = Math.min(theoreticalCapacity, seatsRemaining);
            seatsRemaining -= seatsInRow;

            // Compute angles for the seats.
            let angles: number[] = [];
            if (seatsInRow === 1) {
                angles.push((Math.PI + 0) / 2);
            } else {
                const angleStep = this.arcAngle / (seatsInRow - 1);
                for (let i = 0; i < seatsInRow; i++) {
                    angles.push(Math.PI - i * angleStep);
                }
            }

            // Compute (x,y) positions for each seat.
            let rowSeats: Seat[] = [];
            for (let i = 0; i < seatsInRow; i++) {
                const angle = angles[i];
                const x = this.center[0] + r * Math.cos(angle);
                const y = this.center[1] - r * Math.sin(angle);
                rowSeats.push({ x, y, row: rowIndex, angle });
            }
            seatMatrix.push({ rowIndex, seatsInRow, rowSeats });
            rowIndex++;
        }

        // Flatten the seat matrix.
        let seats: Seat[] = seatMatrix.flatMap(row => row.rowSeats);

        // Determine the number of bins from the outer row's capacity.
        const globalBins = seatMatrix.length > 0 ? seatMatrix[0].seatsInRow : 0;

        // Compute a bin for each seat based solely on its angle.
        // Mapping: angle π → bin 0, angle 0 → bin (globalBins - 1)
        seats.forEach(seat => {
            seat.bin = Math.round(((Math.PI - seat.angle) / Math.PI) * (globalBins - 1));
        });

        // Sort seats by bin value, then by row (outer rows first).
        seats.sort((a, b) => {
            if (a.bin === b.bin) {
                return a.row - b.row;
            }
            return (a.bin ?? 0) - (b.bin ?? 0);
        });

        // Assign party data sequentially in this column-by-column order.
        let seatCounter = 0;
        parties.forEach(party => {
            for (let i = 0; i < party.seats; i++) {
                if (seatCounter < seats.length) {
                    seats[seatCounter].party = party;
                    seatCounter++;
                }
            }
        });

        // Clear previous content.
        this.chartGroup.selectAll("*").remove();

        // -----------------------
        // Render seats.
        // -----------------------
        seats.forEach(seat => {
            this.chartGroup.append("circle")
                .attr("cx", seat.x)
                .attr("cy", seat.y)
                .attr("r", this.seatRadius)
                .attr("fill", seat.party ? seat.party.color + "33" : "gray")
                .attr("stroke", seat.party ? seat.party.color : "gray");
        });

        // -----------------------
        // Show majority line.
        // -----------------------

        const majorityLine = this.chartGroup.append("line")
            .attr("x1", this.center[0])
            .attr("y1", this.center[1] - this.innerRadius + 40)
            .attr("x2", this.center[0])
            .attr("y2", this.center[1] - this.outerRadius - 40)
            .attr("stroke", "#aaa")
            .attr("stroke-dasharray", "2,2")
            .attr("stroke-width", 2);

        const majorityText = this.chartGroup.append("text")
            .attr("x", this.center[0] + 5)
            .attr("y", this.center[1] - this.outerRadius - 40)
            .style("dominant-baseline", "text-before-edge")
            .attr("fill", "#333")
            .attr("font-size", "12px")
            .text("Többség");
    }
}