<script lang="ts">
    import { charts } from "$lib/charts";
    import type { PollData, PollsterGroup } from "$lib/types";
    import PollsChart from "./PollsChart.svelte";

    export let data = {
        sure_voters: [] as PollData,
        all_voters: [] as PollData,
    };
    export let chart_id: string;
    export let voterType = undefined as "sure_voters" | "all_voters" | undefined;
    export let pollsterGroup = undefined as string | undefined;

    const chartData = charts.hasOwnProperty(chart_id) ? charts[chart_id] : null;

    $: effectiveVoterType = voterType || (chartData?.voterType || "sure_voters");
    $: effectivePollsterGroup = pollsterGroup || (chartData?.pollsterGroup || "összes");
</script>

{#if chartData}
    <PollsChart
        id={chart_id}
        pollData={data[effectiveVoterType]}
        selectedParties={chartData.selectedParties}
        dateRange={chartData.dateRange}
        annotations={chartData.annotations}
        renderOptions={chartData.renderOptions}
        selectedPollsterGroup={effectivePollsterGroup as PollsterGroup}
    />
{/if}
