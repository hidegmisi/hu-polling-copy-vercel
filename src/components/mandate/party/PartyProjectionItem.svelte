<script lang="ts">
    import type { Party, Simulation } from "$lib/types";
    import PartyHeader from "./PartyHeader.svelte";
    import PartyMandateProjection from "./PartyMandateProjection.svelte";

    export let party: Party;
    export let simulation: Simulation;
</script>

<article class="article">
    <PartyHeader {party} />
    <PartyMandateProjection
        {party}
        data={simulation?.[party] ?? []}
        median={simulation?.medians[party] ?? 0}
    />
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 6px;

        &:not(:first-child) {
            padding-top: 1rem;
        }
    }
</style>