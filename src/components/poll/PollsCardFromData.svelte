<script lang="ts">
    import { charts } from "$lib/charts";
    import type { PollData } from "$lib/types";
    import PollsCard from "./PollsCard.svelte";

    export let data = {
        sure_voters: [] as PollData,
        all_voters: [] as PollData,
    };
    export let chart_id: string;
    export let showSource: boolean = false;
    export let featured: boolean = false;

    const chartData = charts.hasOwnProperty(chart_id) ? charts[chart_id] : null;
</script>

{#if chartData}
    <PollsCard
        chartId={chart_id}
        data={data}
        title={chartData.title}
        dataSelects={chartData.dataSelects}
        description={chartData.description}
        selectedParties={chartData.selectedParties}
        dateRange={chartData.dateRange}
        annotations={chartData.annotations}
        renderOptions={chartData.renderOptions}
        voterType={chartData.voterType}
        pollsterGroup={chartData.pollsterGroup}
        featured={featured || chartData.featured}
        showSource={showSource}
    />
{/if}