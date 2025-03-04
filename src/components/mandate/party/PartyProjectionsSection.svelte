<script lang="ts">
    import type { Party, Simulation } from "$lib/types";
    import SectionCard from "../../section/SectionCard.svelte";
    import SectionTitle from "../../section/SectionTitle.svelte";
    import SimulationNameSpan from "../SimulationNameSpan.svelte";
    import PartyProjectionItem from "./PartyProjectionItem.svelte";
    import ProjectionExplainers from "../ProjectionExplainers.svelte";

    export let data: Record<string, Simulation> = {};
    export let selectedSimulation = "main";

    $: simulation = data[selectedSimulation];
    $: sortedParties = simulation?.medians 
        ? Object.keys(simulation.medians).sort((a, b) => 
            simulation.medians[b as Party] - simulation.medians[a as Party]
        ) as Party[]
        : [];
</script>

<SectionCard>
    <SectionTitle>Várható mandátumok pártonként</SectionTitle>
    <p>
        Az alábbi ábrán a <SimulationNameSpan>{simulation?.metadata.name}</SimulationNameSpan>
        országos átlaga alapján lefuttatott 10.000 szimuláció eredményeinek
        megoszlása látható.
    </p>
    <ProjectionExplainers />
    {#if simulation?.medians}
        {#each sortedParties as party, i}
            <PartyProjectionItem
                {party}
                {simulation}
            />
        {/each}
    {/if}
</SectionCard>