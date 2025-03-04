<script lang="ts">
    import { onMount } from "svelte";
    import {
        fetchData,
        simulationData,
    } from "$stores/dataStore";
    import type { Party, Simulation } from "$lib/types";
    import MandateProjectionAside from "../../components/mandate/MandateProjectionAside.svelte";
    import OevkMap from "../../components/mandate/map/OEVKMap.svelte";
    import ParliamentChart from "../../components/mandate/parliament/ParliamentChart.svelte";
    import PartyMandateTable from "../../components/mandate/party/PartyMandateTable.svelte";
    import SectionCard from "../../components/section/SectionCard.svelte";
    import SectionTitle from "../../components/section/SectionTitle.svelte";
    import StickyAside from "../../components/grid/StickyAside.svelte";
    import GridItem from "../../components/grid/GridItem.svelte";
    import ExplainerCard from "../../components/section/ExplainerCard.svelte";
    import SimulationNameSpan from "../../components/mandate/SimulationNameSpan.svelte";
    import PartyProjectionsSection from "$components/mandate/party/PartyProjectionsSection.svelte";

    let data: Record<string, Simulation> = {};
    let selectedSimulation = "main";

    function selectSimulation(simulation: string) {
        selectedSimulation = simulation;
    }

    onMount(fetchData);

    $: data = $simulationData;
</script>

<StickyAside>
    <MandateProjectionAside
        {data}
        on:selectSimulation={(e) => selectSimulation(e.detail)}
    />
</StickyAside>
<GridItem variant="main">
    <SectionCard id="parliament-chart">
        <SectionTitle>A legvalószínűbb parlament</SectionTitle>
        <p>
            Az alábbi ábrán a <SimulationNameSpan
                >{data[selectedSimulation]?.metadata.name}</SimulationNameSpan
            >
            országos átlaga és az EP-választás választási földrajza alapján szimulált
            országgyűlési választás eredménye látható.
        </p>
        <ExplainerCard
            image="/images/hungary-shape.webp"
            alt="Választási földrajz"
        >
            A szimuláció azt feltételezi, hogy az EP-választás óta nem változott
            a választási földrajz, de az ellenzéki szavazók nagyobb része szavaz
            majd a Tiszára.
            <a href="#">Módszertan</a>
        </ExplainerCard>
        <ParliamentChart {data} {selectedSimulation} />
        <PartyMandateTable data={data[selectedSimulation]?.seats} />
    </SectionCard>
</GridItem>
<GridItem variant="main">
    <PartyProjectionsSection {data} {selectedSimulation} />
</GridItem>
<GridItem variant="main">
    <SectionCard>
        <SectionTitle>Egyéni választókerületek térképe</SectionTitle>
        <p>
            Az alábbi térképen a 106 egyéni választókerület látható, és a
            <SimulationNameSpan>
                {data[selectedSimulation]?.metadata.name}
            </SimulationNameSpan>
            által becsült várható különbség a két esélyes párt között.
        </p>
        <ExplainerCard
            image="/images/hungary-shape.webp"
            alt="Választási földrajz"
        >
            A szimuláció azt feltételezi, hogy az EP-választás óta nem
            változott a választási földrajz, de az ellenzéki szavazók
            nagyobb része szavaz majd a Tiszára.
            <a href="#">Módszertan</a>
        </ExplainerCard>
        <OevkMap data={data[selectedSimulation]?.oevkDiffs} />
    </SectionCard>
</GridItem>