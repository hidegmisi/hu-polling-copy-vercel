<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { pollData, fetchData } from "$stores/dataStore";
    import type { PollData, PollsterGroup } from "$lib/types";
    import PollsCardFromData from "$components/poll/PollsCardFromData.svelte";
    import PollsCard from "$components/poll/PollsCard.svelte";
    import GridItem from "$components/grid/GridItem.svelte";
    import PollsChartFromData from "$components/poll/PollsChartFromData.svelte";

    let chartId: string;
    let showOnlyChart: boolean;
    let voterType: "sure_voters" | "all_voters" | undefined;
    let pollsterGroup: PollsterGroup | undefined;

    let data = {
        sure_voters: [] as PollData,
        all_voters: [] as PollData,
    };

    onMount(() => {
        fetchData();
        // Add styles for embedded view
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.background = "transparent";
    });

    $: chartId = $page.params.chartId;
    $: showOnlyChart = $page.url.searchParams.get("chart_only") === "true";
    $: voterType = $page.url.searchParams.get("voter_type") as "sure_voters" | "all_voters" | undefined;
    $: pollsterGroup = $page.url.searchParams.get("pollster_group") as PollsterGroup | undefined;

    $: data = $pollData;
</script>

<GridItem variant="full">
    <div class="embed-container">
        {#if !showOnlyChart}
            <PollsCardFromData
                {data}
                chart_id={chartId}
                showSource={!showOnlyChart}
                featured={false}
            />
        {/if}
        <div class="embed-chart">
            <PollsChartFromData
                {data}
                chart_id={chartId}
                voterType={voterType}
                pollsterGroup={pollsterGroup}
            />
            <div class="attribution">
                <p>Ábra: Vox Populi</p>
                <p><a target="_blank" href="https://valasztas-2026.kozvelemeny.org">valasztas-2026.kozvelemeny.org</a></p>
            </div>
        </div>
    </div>
</GridItem>

<style lang="scss">
    :global(#mainHeader, .menuStrip) {
        display: none !important;
    }

    :global(#appContainer) {
        padding: 0 !important;
    }

    .embed-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .embed-chart {
        margin-top: -1rem;
        .attribution {
            display: flex;
            justify-content: space-between;
            width: 100%;
            
            margin: 0;
            margin-top: -2rem;
            padding: 4px 12px;
            padding-top: 1rem;
            
            background-color: #f5f5f5;
            z-index: -1;

            p {
                margin: 0;
                color: #666;
            }

            a {
                color: #666;
                text-decoration: none;
            }
        }
    }

    :global(body) {
        overflow: hidden;
    }
</style>
