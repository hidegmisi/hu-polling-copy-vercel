<script lang="ts">
    import { onMount } from "svelte";
    import { fetchData, partyData, simulationData } from "../../stores/dataStore";
    import PartyMandateProjection from "../../components/PartyMandateProjection.svelte";
    import MandateProjectionAside from "../../components/MandateProjectionAside.svelte";
    import OevkMap from "../../components/OEVKMap.svelte";
    import ParliamentChart from "../../components/ParliamentChart.svelte";
    import PartyMandateTable from "../../components/PartyMandateTable.svelte";
    import type { Party, Simulation } from "$lib/types";

    let data: Record<string, Simulation> = {};

    let aside: HTMLElement;

    function keepAsidePosition() {
        const headerHeight = 160 + 55;
        if (aside === null) return;

        if (window.scrollY > headerHeight + 16 && window.innerWidth > 600) {
            aside.style.position = "fixed";
            aside.style.top = "16px";
            aside.style.width = "250px";
        } else {
            aside.style.position = "static";
            aside.style.width = "auto";
        }
    }

    onMount(() => {
        fetchData();
        window.addEventListener("scroll", keepAsidePosition);
    });

    $: {
        data = $simulationData;
        
    };
</script>

<aside bind:this={aside}>
    <MandateProjectionAside {data} />
</aside>
<main>
    <section class="parliamentChart">
        <div class="textBlock">
            <h2>A legvalószínűbb parlament</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, nemo voluptate dolor aut corporis eveniet facere unde, quia sit, fugiat optio odit enim fuga obcaecati laboriosam accusantium repudiandae soluta. Quo?</p>
        </div>
        <ParliamentChart {data}/>
        <PartyMandateTable data={data['main']?.seats} />
        <div class="textBlock">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, nemo voluptate dolor aut corporis eveniet facere unde, quia sit, fugiat optio odit enim fuga obcaecati laboriosam accusantium repudiandae soluta. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut nesciunt expedita magnam deserunt, itaque nobis reiciendis sequi voluptas distinctio veniam cumque temporibus dolorem asperiores ipsum rem quaerat est. Laboriosam, suscipit!</p>
        </div>
    </section>
    <section class="partyProjections">
        <div class="textBlock">
            <h2>Várható mandátumok pártonként</h2>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta accusantium impedit repellat dolorem ullam totam veritatis nemo nam, et reprehenderit nostrum sed labore repudiandae quis tenetur illum necessitatibus provident sit. Provident delectus, sunt perspiciatis sed alias, exercitationem dolorum modi quo animi repudiandae qui unde. Dolorem incidunt debitis fugit esse! In, magnam! Debitis!</p>
            <div class="explainer">
                <div class="example median">
                    <img src="/images/median-example.webp" alt="Medián jelzés példa">
                </div>
                <p>A függőleges vonal a középérteket jelzi, vagyis ugyanannyi eséllyel kap ennél több vagy kevesebb mandátumot egy adott párt.</p>
            </div>
            <div class="explainer">
                <div class="example">
                    <img src="/images/PDF-example.webp" alt="Valószínűség eloszlás példa">
                </div>
                <p>A színezett terület a lehetséges eredményeket mutatja. A mandátumszámokhoz tartozó magasság jelzi, hogy milyen valószínű egy adott kimenetel.</p>
            </div>
        </div>
        {#if data.main}
            {#each Object.keys(data.main?.medians).sort((a, b) => data.main.medians[b as Party] - data.main.medians[a as Party]) as party, i}
                <article>
                    <header>
                        <img src={`/images/party-logo/${party}.png`} alt={party} />
                        <h3>{partyData[party as Party].name}</h3>
                    </header>
                    <PartyMandateProjection
                        party={party as Party}
                        data={data.main[party as Party]} 
                        median={data.main.medians[party as Party]}
                    />
                </article>
                {#if i < Object.keys(data.main.medians).length - 1}
                    <div class="divider"></div>
                {/if}
            {/each}
        {/if}
    </section>
    <section class="map">
        <h2>Választókerületek legvalószínűbb eredménye</h2>
        <p>Országos mandátumok várható eloszlása a közvélemény-kutatások alapján.</p>
        <OevkMap />
    </section>
</main>


<style lang="scss">
    main {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    section {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 2rem 1rem;
        padding-top: 8px;
        background-color: #fcfcfc;
        border: 1px solid #eee;
        
        &.partyProjections {
            display: grid;
            grid-template-columns: 1fr;

            .textBlock {
                grid-column: 1 / 3;

                &:first-child {
                    margin-bottom: 6px;
                }

                .explainer {
                    display: flex;
                    margin: 1rem 0;
                    border: 1px solid #eee;
                    background-color: #f9f9f9;
                    padding: 12px 6px;

                    p {
                        margin: 0;
                    }

                    .example {
                        flex-shrink: 0;
                        margin-right: 12px;
                        display: flex;
                        width: 60px;
                        
                        img {
                            width: 100%;
                            object-fit: contain;
                            filter: grayscale(1);
                        }
                    }
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
                }
            }
        }

        h2 {
            font-size: 26px;
            font-weight: 500;
        }

        h3 {
            font-size: 18px;
            font-weight: 400;
        }

        .textBlock {
            p {
                margin-top: 6px;
            }
        }

        .divider {
            grid-column: 1 / 3;
            border-top: 2px solid #eee;
            margin-top: 1rem;
        }
    }

    @media (min-width: 600px) {
        main {
            grid-column: 2 / 3;
        }
    }
    
    @media (min-width: 800px) {
        aside {
            grid-column: 1 / 2;
        }
        
        main {
            grid-column: 2 / 5;
        }
    }
</style>
