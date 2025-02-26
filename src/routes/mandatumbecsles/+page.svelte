<script lang="ts">
    import { onMount } from "svelte";
    import { fetchData, simulationData } from "../../stores/dataStore";
    import PartyMandateProjection from "../../components/PartyMandateProjection.svelte";
    import MandateProjectionAside from "../../components/MandateProjectionAside.svelte";
    import OevkMap from "../../components/OEVKMap.svelte";
    import ParliamentChart from "../../components/ParliamentChart.svelte";
    import PartyMandateTable from "../../components/PartyMandateTable.svelte";

    let data: Record<string, any> = {};

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

    $: data = $simulationData;
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
        <PartyMandateTable data={data['main']?.medians} />
        <div class="textBlock">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, nemo voluptate dolor aut corporis eveniet facere unde, quia sit, fugiat optio odit enim fuga obcaecati laboriosam accusantium repudiandae soluta. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut nesciunt expedita magnam deserunt, itaque nobis reiciendis sequi voluptas distinctio veniam cumque temporibus dolorem asperiores ipsum rem quaerat est. Laboriosam, suscipit!</p>
        </div>
    </section>
    <section class="partyProjections">
        <div class="textBlock">
            <h2>Várható mandátumok pártonként</h2>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta accusantium impedit repellat dolorem ullam totam veritatis nemo nam, et reprehenderit nostrum sed labore repudiandae quis tenetur illum necessitatibus provident sit. Provident delectus, sunt perspiciatis sed alias, exercitationem dolorum modi quo animi repudiandae qui unde. Dolorem incidunt debitis fugit esse! In, magnam! Debitis!</p>
        </div>
        <article>
            <h3>Tisza</h3>
            <p>x százalék a közvélemény-kutatásokban</p>
        </article>
        <PartyMandateProjection
            party="tisza"
            data={data.main?.tisza} 
            median={data.main?.medians?.tisza}
        />
        <div class="divider"></div>
        <article>
            <h3>Fidesz</h3>
            <p>x százalék a közvélemény-kutatásokban</p>
        </article>
        <PartyMandateProjection
            party="fidesz"
            data={data.main?.fidesz} 
            median={data.main?.medians?.fidesz}
        />
        <div class="divider"></div>
        <article>
            <h3>DK-MSZP-P</h3>
            <p>x százalék a közvélemény-kutatásokban</p>
        </article>
        <PartyMandateProjection
            party="dk_mszp_p"
            data={data.main?.dk_mszp_p} 
            median={data.main?.medians?.dk_mszp_p}
        />
        <div class="divider"></div>
        <article>
            <h3>Mi Hazánk</h3>
            <p>x százalék a közvélemény-kutatásokban</p>
        </article>
        <PartyMandateProjection
            party="mihazank"
            data={data.main?.mihazank} 
            median={data.main?.medians?.mihazank}
        />
        <div class="divider"></div>
        <article>
            <h3>MKKP</h3>
            <p>x százalék a közvélemény-kutatásokban</p>
        </article>
        <PartyMandateProjection
            party="mkkp"
            data={data.main?.mkkp} 
            median={data.main?.medians?.mkkp}
        />
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
        padding: 8px 1rem;
        background-color: #fcfcfc;
        border: 1px solid #eee;
        
        &.partyProjections {
            display: grid;
            grid-template-columns: 150px 1fr;

            .textBlock {
                grid-column: 1 / 3;

                &:first-child {
                    margin-bottom: 6px;
                }
            }
        }

        h2 {
            font-size: 26px;
            font-weight: 500;
        }

        h3 {
            font-size: 22px;
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
            margin: 1rem 0;
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
