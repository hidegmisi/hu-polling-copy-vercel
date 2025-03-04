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
    import PollsCard from "./PollsCard.svelte";

    export let data = {
        sure_voters: [] as PollData,
        all_voters: [] as PollData,
    };
    export let description = "";
    export let selectedParties = undefined as Party[] | undefined;
    export let dateRange = undefined as DateRange | undefined;
    export let annotations = [] as Annotation[];
    export let renderOptions = undefined as Record<string, any> | undefined;
    export let voterType = "sure_voters" as "sure_voters" | "all_voters";
    export let pollsterGroup = "összes" as PollsterGroup;

    export let featured = false;

    let chartOptions = {
        data: [] as Poll[],
        pollsterGroupIndex: (pollsterGroups.findIndex((group) => group === pollsterGroup) || 0) as 0 | 1 | 2,
    };

    onMount(() => {
        const loadingInterval = setInterval(() => {
            if (!chartOptions.data.length && data[voterType]?.length) {
                chartOptions.data = data[voterType];
                clearInterval(loadingInterval);
            }
        }, 10);
    })
</script>

<article class="interactiveContainer" class:featured={featured}>
    <aside>

    </aside>
    <main>
        <PollsCard
            {data}
            title="Interaktív ábra"
            {description}
            {selectedParties}
            {dateRange}
            {annotations}
            {renderOptions}
            {voterType}
            {pollsterGroup}
            {featured}
        />
    </main>
</article>

<style lang="scss">
    .interactiveContainer {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        padding: 8px;
        width: 100%;
        margin: 0 auto;

        border: 1px dashed #eee;

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

    @media (min-width: 600px) {
        .interactiveContainer {
            grid-template-columns: 200px 1fr;
        }
    }

    @media (min-width: 800px) {
        .interactiveContainer {
            grid-template-columns: 250px 1fr;
        }
    }
</style>
