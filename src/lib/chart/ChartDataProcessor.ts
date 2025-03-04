import * as d3 from "d3";
import type { PollData, DateRange, Party, AxisParams, DayData, PollsterGroup, PollsterData } from "../types";
import { pollsterData } from "$stores/dataStore";

export class ChartDataProcessor {
    private pollData: PollData;
    private dateRange: DateRange;
    private partyIntervals: Record<Party, [Date, Date][]>;
    private selectedParties: Party[];
    private selectedPollsterGroup: PollsterGroup;
    private renderOptions: Record<string, unknown> | undefined;

    constructor(
        pollData: PollData, 
        dateRange: DateRange, 
        partyIntervals: Record<Party, [Date, Date][]>, 
        selectedParties: Party[], 
        selectedPollsterGroup: PollsterGroup,
        renderOptions?: Record<string, unknown> | undefined
    ) {
        this.pollData = pollData;
        this.dateRange = dateRange;     
        this.partyIntervals = partyIntervals;
        this.selectedParties = selectedParties;
        this.selectedPollsterGroup = selectedPollsterGroup;
        this.renderOptions = renderOptions;
    }

    public getAxisParams(dailyData: DayData[], hasAnnotations = false): AxisParams {
        const millisPerDay = 1000 * 60 * 60 * 24;
        const dateDiff = (this.dateRange.end.getTime() - this.dateRange.start.getTime()) / millisPerDay;
    
        const xTickLevel = dateDiff > (3 * 365) ? "year" : dateDiff > (365 / 2) ? "quarter" : "month";
        const possibleYTicks = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9];
        
        const allValues = dailyData.flatMap(d =>
            Object.values(d).filter(value => typeof value === "number") as number[]
        );
    
        if (allValues.length === 0) return { xTickLevel, yLims: [0, 1], ticks: possibleYTicks, dateRange: this.dateRange };
    
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);

        const annotationPadding = hasAnnotations ? 0.1 : 0;
    
        const lowerLimit = this.renderOptions?.yLims ? 
            (this.renderOptions['yLims'] as [number, number])[0] : 0;
        const upperLimit = this.renderOptions?.yLims ? 
            (this.renderOptions['yLims'] as [number, number])[1] :
            (possibleYTicks.find(curr => curr >= maxValue) ?? 0.95) + 0.05 + annotationPadding;
    
        const ticks = possibleYTicks.filter(tick => tick >= lowerLimit && tick <= upperLimit);
    
        return { xTickLevel, yLims: [+lowerLimit.toFixed(2), +upperLimit.toFixed(2)], ticks, dateRange: this.dateRange };
    }

    public processData(): [PollData, DayData[], number] {
        let data = this.applyPollsterGroupFilter(this.pollData);
        
        data = this.applyDateRangeFilter(data);
        data = this.applyPartyIntervalsFilter(data);

        const dateExtent = d3.extent(data, (d) => d.date) as [Date, Date];
        
        const windowDays = dateExtent[1].getTime() - dateExtent[0].getTime() < 2 * 365 * 24 * 60 * 60 * 1000 ? 30 : 90;

        const dayData = this.renderOptions?.smoothing === "lowess" ?
            this.calculateLOWESS(data, windowDays) :
            this.calculateMovingAverages(data, windowDays);

        return [data, dayData, windowDays];
    }

    private applyPollsterGroupFilter(pollData: PollData): PollData {
        if (this.selectedPollsterGroup === "összes") {
            return pollData;
        }
    
        const pollsters = Object.values(pollsterData).filter((d) => d.group === this.selectedPollsterGroup).map((d) => d.name);
    
        return pollData.filter((d) => pollsters.includes(d.pollster));
    }

    private applyDateRangeFilter(pollData: PollData): PollData {
        const dateRange = this.dateRange;
        
        if (dateRange === null) {
            return pollData;
        }
        
        return pollData.filter((d) => {
            return d.date >= dateRange.start && d.date <= dateRange.end;
        });
    }

    private applyPartyIntervalsFilter(pollData: PollData): PollData {
        pollData.forEach((poll) => {
            for (const party of Object.keys(this.partyIntervals) as Party[]) {
                const isInInterval = this.partyIntervals[party].some(([start, end]) => poll.date >= start && poll.date <= end);
                if (!isInInterval) {
                    poll[party] = undefined;
                }
            }
        });
        return pollData;
    }

    private calculateMovingAverages(pollData: PollData, windowDays = 30): DayData[] {
        const dateExtent = d3.extent(pollData, (d) => d.date) as [Date, Date];
        const dates = d3.timeDay.range(dateExtent[0], dateExtent[1]);
        const movingAvg: DayData[] = [];
    
        for (const date of dates) {
            const pollsWithinWindow = pollData.filter((d) => {
                return (
                    d.date.getTime() >= date.getTime() - windowDays * 24 * 60 * 60 * 1000 &&
                    d.date.getTime() <= date.getTime() + windowDays * 24 * 60 * 60 * 1000
                );
            });
    
            movingAvg.push({ date });
    
            for (const party of this.selectedParties) {
                const pollsWithParty = pollsWithinWindow.filter((d) => (d[party] !== undefined) && (d[party] !== null) && (d[party] > 0.01));
                const avg = d3.mean(pollsWithParty, (d) => d[party]);
                if (avg === 0 || pollsWithParty.length < 1) {
                    movingAvg[movingAvg.length - 1][party] = undefined;
                    continue;
                }
                movingAvg[movingAvg.length - 1][party] = avg;
            }
        }
    
        return movingAvg;
    }

    private calculateLOWESS(pollData: PollData, windowDays = 30): DayData[] {
        const dateExtent = d3.extent(pollData, (d) => d.date) as [Date, Date];
        const dates = d3.timeDay.range(dateExtent[0], dateExtent[1]);
        const smoothedData: DayData[] = [];
    
        for (const date of dates) {
            const weights: number[] = [];
            const localPoints: { date: Date; values: Record<Party, number> }[] = [];
    
            for (const poll of pollData) {
                const distance = Math.abs(poll.date.getTime() - date.getTime()) / (windowDays * 24 * 60 * 60 * 1000);
                const weight = Math.exp(-Math.pow(distance, 2)); // Gaussian kernel function
                weights.push(weight);
                localPoints.push({ date: poll.date, values: { ...poll } });
            }
    
            const smoothedPoint: DayData = { date };
    
            for (const party of this.selectedParties) {
                const weightedValues = localPoints
                    .map((point, i) => (point.values[party] ? point.values[party] * weights[i] : 0))
                    .filter(v => v > 0);
                
                const weightSum = weights.reduce((a, b) => a + b, 0);
                const avg = weightedValues.length > 0 ? weightedValues.reduce((a, b) => a + b, 0) / weightSum : undefined;
    
                smoothedPoint[party] = avg;
            }
    
            smoothedData.push(smoothedPoint);
        }
    
        return smoothedData;
    }
}