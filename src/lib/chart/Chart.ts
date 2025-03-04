import { ChartRenderer } from "./ChartRenderer";
import { ChartDataProcessor } from "./ChartDataProcessor";
import type { Annotation, AxisParams, DateRange, DayData, Party, PollData, PollsterGroup } from "../types";
import { partyData } from "$stores/dataStore";

export class Chart {
    private containerElement: HTMLElement;
    private pollData: PollData;
    private selectedParties: Party[];
    private selectedPollsterGroup: PollsterGroup;
    private dateRange: DateRange;
    private partyIntervals: Record<Party, [Date, Date][]>;
    private annotations: Annotation[] = [];
    private renderOptions: Record<string, unknown> | undefined;
    private renderer: ChartRenderer;
    private dataProcessor: ChartDataProcessor;
    private processedData: [PollData, DayData[], number] | null = null;
    private resizeDebounce: number | null = null;

    public windowDays = 0;

    constructor(containerElement: HTMLElement, pollData: PollData, options: {
        selectedParties?: Party[],
        selectedPollsterGroup?: PollsterGroup,
        dateRange?: DateRange,
        partyIntervals?: Record<Party, [Date, Date][]>,
        annotations?: Annotation[],
        renderOptions?: Record<string, unknown> | undefined,
    } = {}) {
        this.containerElement = containerElement;
        this.pollData = pollData;
        this.selectedParties = options.selectedParties ?? Object.keys(partyData) as Party[];
        this.selectedPollsterGroup = options.selectedPollsterGroup ?? "összes";
        this.dateRange = options.dateRange ?? { start: new Date(2018, 0, 0), end: new Date() };
        this.partyIntervals = options.partyIntervals ?? this.getDefaultPartyIntervals();
        this.annotations = options.annotations ?? [];
        this.renderOptions = options.renderOptions;
        
        this.dataProcessor = new ChartDataProcessor(
            this.pollData,
            this.dateRange,
            this.partyIntervals,
            this.selectedParties,
            this.selectedPollsterGroup,
            this.renderOptions,
        );
        this.renderer = new ChartRenderer(this.containerElement);
        this.init();

    }

    private init() {
        window.addEventListener("resize", () => this.onResize());
        this.render();
    }

    private getDefaultPartyIntervals(): Record<Party, [Date, Date][]> {
        return Object.fromEntries(this.selectedParties.map(party => [
            party,
            [[new Date(2018, 0, 0), new Date()]],
        ])) as Record<Party, [Date, Date][]>;
    }

    private onResize() {
        if (this.resizeDebounce) {
            clearTimeout(this.resizeDebounce);
        }
        this.resizeDebounce = window.setTimeout(() => {
            this.render();
        }, 100);
    }

    public render() {
        this.renderer.render(this.selectedParties, this.annotations, this.renderOptions, this.dateRange);
    }

    public setOptions(updatedOptions: {
        pollData?: PollData;
        selectedParties?: Party[];
        selectedPollsterGroup?: PollsterGroup;
        dateRange?: DateRange;
        partyIntervals?: Record<Party, [Date, Date][]>;
        annotations?: Annotation[];
        renderOptions?: Record<string, unknown>;
    }) {
        for (const key of Object.keys(updatedOptions) as (keyof typeof updatedOptions)[]) {
            if (updatedOptions[key] === undefined) continue;
            (this as any)[key] = updatedOptions[key];
        }
    
        if (
            updatedOptions.pollData !== undefined ||
            updatedOptions.selectedParties !== undefined ||
            updatedOptions.dateRange !== undefined ||
            updatedOptions.partyIntervals !== undefined
        ) {
            this.updateChartData();
        }
    
        if (updatedOptions.annotations !== undefined) {
            this.renderer.updateAnnotations(this.annotations);
        }

        if (updatedOptions.dateRange !== undefined) {
            this.updateAxis();
        }
    }
    
    private updateChartData() {
        this.dataProcessor = new ChartDataProcessor(
            this.pollData, 
            this.dateRange, 
            this.partyIntervals, 
            this.selectedParties, 
            this.selectedPollsterGroup, 
            this.renderOptions
        );

        this.processedData = this.dataProcessor.processData();
        this.windowDays = this.processedData[2];
        this.renderer.updateData(this.processedData[0], this.processedData[1], this.selectedParties);
    }
    
    private updateAxis() {
        if (!this.processedData) {
            this.processedData = this.dataProcessor.processData();
            this.windowDays = this.processedData[2];
        }
        this.renderer.updateAxisLimits(this.dataProcessor.getAxisParams(this.processedData[1], !!this.annotations.length));
    }
}