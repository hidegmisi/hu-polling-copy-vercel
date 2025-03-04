<script lang="ts">
    import type {
        Annotation,
        DataSelect,
        DateRange,
        Party,
        Poll,
        PollData,
        PollsterGroup,
    } from "$lib/types";
    import { onMount } from "svelte";
    import { pollsterGroups } from "$stores/dataStore";
    import PollsChart from "./PollsChart.svelte";
    import BottomMenu from "$components/ui/bottomMenu/BottomMenu.svelte";
    import BottomMenuItem from "$components/ui/bottomMenu/BottomMenuItem.svelte";

    export let data = {
        sure_voters: [] as PollData,
        all_voters: [] as PollData,
    };
    export let chartId = null as string | null;
    export let title: string;
    export let dataSelects = [] as DataSelect[];
    export let description = "";
    export let selectedParties = undefined as Party[] | undefined;
    export let dateRange = undefined as DateRange | undefined;
    export let annotations = [] as Annotation[];
    export let renderOptions = {} as Record<string, any> | undefined;
    export let voterType = "sure_voters" as "sure_voters" | "all_voters";
    export let pollsterGroup = "összes" as PollsterGroup;
    
    export let featured = false;
    export let showSource = false;

    let chartOptions = {
        data: [] as Poll[],
        pollsterGroupIndex: (pollsterGroups.findIndex((group) => group === pollsterGroup) || 0) as 0 | 1 | 2,
        smoothing: "movingAverage" as "movingAverage" | "lowess",
    };

    let articleMap = {
        0: "az",
        1: "a\xa0",
        2: "a\xa0",
        3: "az",
    };

    let windowDays = 0;

    onMount(() => {
        const loadingInterval = setInterval(() => {
            if (!chartOptions.data.length && data[voterType]?.length) {
                chartOptions.data = data[voterType];
                clearInterval(loadingInterval);
            }
        }, 10);
    })
</script>

<article class="pollGraph" class:featured={featured}>
    <h1>{title}</h1>
    <div class="description">
        <p>
            {#if dataSelects.includes("voter_type")}
                a
                <select bind:value={chartOptions.data}>
                    <option value={data.sure_voters}>biztos szavazók</option>
                    <option value={data.all_voters}>választókorúak</option>
                </select>
                körében {#if dataSelects.includes("pollster_group")}
                    ,
                {:else}
                    .
                {/if}
            {/if}
            {#if dataSelects.includes("pollster_group")}
                {articleMap[chartOptions.pollsterGroupIndex]}
                <select bind:value={chartOptions.pollsterGroupIndex}>
                    {#each pollsterGroups as group, i}
                        <option value={i}>{group}</option>
                    {/each}
                </select>
                közvélemény-kutató{!chartOptions.pollsterGroupIndex ? '' : 'k'} adatai alapján.
            {/if}
        </p>
        <p>
            {windowDays} napos
            <select bind:value={chartOptions.smoothing}>
                <option value="movingAverage">mozgóátlag</option>
                <option value="lowess">LOWESS-regresszió</option>
            </select>
        </p>
        <p>{description}</p>
    </div>
    <PollsChart
        id={"chart" + (Math.random() * 10000).toFixed(0)}
        pollData={chartOptions.data}
        {selectedParties}
        selectedPollsterGroup={pollsterGroups[chartOptions.pollsterGroupIndex]}
        {dateRange}
        {annotations}
        renderOptions={{...renderOptions, smoothing: chartOptions.smoothing}}

        on:updateWindowDays={(e) => windowDays = e.detail}
    />
    <BottomMenu>
        <BottomMenuItem>Módszertan</BottomMenuItem>
        {#if chartId}
        <BottomMenuItem>Megosztás</BottomMenuItem>
        {/if}
    </BottomMenu>
    {#if showSource}
    <div class="source">
        <p>
            Választás 2026 – Vox Populi, https://valami.hu<br>
        </p>
    </div>
    {/if}
</article>

<style lang="scss">
    .pollGraph {
        padding: 8px 1rem;
        width: 100%;
        margin: 0 auto;

        background-color: #fcfcfc;
        border: 1px solid #eee;

        &.featured {
            h1 {
                font-size: 26px;
                font-weight: 500;
            }
        }

        h1 {
            font-size: 22px;
            font-weight: 400;
        }

        .description {
            margin-top: 8px;
            margin-bottom: 1rem;
        }

        p {
            margin-top: 6px;

            select {
                padding: 2px;
                width: fit-content;
                min-width: unset;
            }
        }
    }

    @media (min-width: 800px) {
        .pollGraph {
            grid-column: span 2;
            grid-row: span 1;
        }
    }
</style>
