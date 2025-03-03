<script lang="ts">
    import { onMount } from "svelte";
    import {
        fetchData,
        partyData,
        simulationData,
    } from "../../stores/dataStore";
    import PartyMandateProjection from "../../components/mandateProjection/PartyMandateProjection.svelte";
    import MandateProjectionAside from "../../components/mandateProjection/MandateProjectionAside.svelte";
    import OevkMap from "../../components/OEVKMap.svelte";
    import ParliamentChart from "../../components/ParliamentChart.svelte";
    import PartyMandateTable from "../../components/mandateProjection/PartyMandateTable.svelte";
    import type { Party, Simulation } from "$lib/types";
    import SectionCard from "../../components/section/SectionCard.svelte";
    import SectionTitle from "../../components/section/SectionTitle.svelte";
    import StickyAside from "../../components/grid/StickyAside.svelte";
    import GridItem from "../../components/grid/GridItem.svelte";
    import ExplainerCard from "../../components/section/ExplainerCard.svelte";
    import SimulationNameSpan from "../../components/mandateProjection/SimulationNameSpan.svelte";

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
        <!-- <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, nemo voluptate
            dolor aut corporis eveniet facere unde, quia sit, fugiat optio odit enim fuga obcaecati
            laboriosam accusantium repudiandae soluta. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Aut nesciunt expedita magnam deserunt, itaque nobis reiciendis sequi
            voluptas distinctio veniam cumque temporibus dolorem asperiores ipsum rem quaerat est.
            Laboriosam, suscipit!
        </p> -->
    </SectionCard>
</GridItem>
<GridItem variant="main">
    <SectionCard>
        <section class="partyProjections">
            <div class="textBlock">
                <SectionTitle>Várható mandátumok pártonként</SectionTitle>
                <p>
                    Az alábbi ábrán a <SimulationNameSpan>{data[selectedSimulation]?.metadata.name}</SimulationNameSpan
                    >
                    országos átlaga alapján lefuttatott 10.000 szimuláció eredményeinek
                    megoszlása látható.
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
                <ExplainerCard
                    image="/images/median-example.webp"
                    alt="Medián jelzés példa"
                >
                    A függőleges vonal a középérteket jelzi, vagyis ugyanannyi
                    szimulációban kapott ennél több vagy kevesebb mandátumot egy
                    adott párt.
                </ExplainerCard>
                <ExplainerCard
                    image="/images/PDF-example.webp"
                    alt="Valószínűség eloszlás példa"
                >
                    A színezett terület a lehetséges eredményeket és azok
                    valószínűségét mutatja. Minél több szimulációban fordult elő
                    egy mandátumszám, annál magasabb a terület.
                </ExplainerCard>
            </div>
            {#if data.main}
                {#each Object.keys(data.main?.medians).sort((a, b) => data.main.medians[b as Party] - data.main.medians[a as Party]) as party, i}
                    <article>
                        <header>
                            <img
                                src={`/images/party-logo/${party}.png`}
                                alt={party}
                            />
                            <h3>{partyData[party as Party].name}</h3>
                        </header>
                        <PartyMandateProjection
                            party={party as Party}
                            data={data[selectedSimulation][party as Party]}
                            median={data[selectedSimulation].medians[
                                party as Party
                            ]}
                        />
                    </article>
                    {#if i < Object.keys(data[selectedSimulation].medians).length - 1}
                        <div class="divider"></div>
                    {/if}
                {/each}
            {/if}
        </section>
    </SectionCard>
</GridItem>
<GridItem variant="main">
    <SectionCard>
        <SectionTitle>Egyéni választókerületek térképe</SectionTitle>
        <p>
            Az alábbi térképen a 106 egyéni választókerület látható, és a
            <SimulationNameSpan
                >{data[selectedSimulation]?.metadata.name}</SimulationNameSpan
            >
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

<style lang="scss">
    .partyProjections {
        display: grid;
        grid-template-columns: 1fr;

        .textBlock {
            grid-column: 1 / 3;

            &:first-child {
                margin-bottom: 6px;
            }
        }

        article {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            header {
                display: grid;
                grid-template-columns: 24px 1fr;
                align-items: center;
                gap: 6px;
                padding: 0 30px;

                img {
                    width: 24px;
                    height: 24px;
                    object-fit: contain;
                }

                h3 {
                    font-size: 18px;
                    font-weight: 400;
                }
            }
        }

        .textBlock {
            p {
                margin-top: 6px;
            }
        }

        .divider {
            grid-column: 1 / 3;
            border-top: 1px solid #eee;
            margin-top: 6px;
        }
    }
</style>
