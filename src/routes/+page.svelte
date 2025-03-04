<script lang="ts">
    import type { Party, PollData, Simulation } from "$lib/types";
    import { onMount } from "svelte";
    import {
        pollData,
        simulationData,
        fetchData,
        pollsterGroups,
        partyData,
    } from "../stores/dataStore";
    import RecentPollsAside from "../components/RecentPollsAside.svelte";
    import MiniMandateProjection from "../components/mandateProjection/MiniMandateProjection.svelte";
    import PollsCardFromData from "../components/PollsCardFromData.svelte";
    import ParliamentChart from "../components/ParliamentChart.svelte";
    import PartyMandateTable from "../components/mandateProjection/PartyMandateTable.svelte";
    import OevkMap from "../components/OEVKMap.svelte";
    import SectionCard from "../components/section/SectionCard.svelte";
    import SectionTitle from "../components/section/SectionTitle.svelte";
    import GridItem from "../components/grid/GridItem.svelte";
    import GridSectionTitle from "../components/grid/GridSectionTitle.svelte";
    import SimulationNameSpan from "../components/mandateProjection/SimulationNameSpan.svelte";
    import ExplainerCard from "../components/section/ExplainerCard.svelte";

    let data = {
        sure_voters: [] as PollData,
        all_voters: [] as PollData,
        simulationData: {} as Record<string, Simulation>,
    };

    onMount(fetchData);

    $: data = {
        sure_voters: $pollData.sure_voters,
        all_voters: $pollData.all_voters,
        simulationData: $simulationData,
    }
</script>

<GridItem variant="aside">
    <aside id="mandate-projection">
        <h2>Mandátumbecslés</h2>
        <p>
            A Fidesz és a Tisza képviselőinek várható aránya az EP-választás
            és a friss kutatások átlaga alapján:
        </p>
        <div class="mandatesContainer">
            <article class="visualization">
                <MiniMandateProjection data={data.simulationData} />
            </article>
        </div>
        <p>
            Részletes adatok és alakulásuk a <a href="/mandatumbecsles"
                >mandátumbecslés</a
            > oldalon.
        </p>
        <div class="bottomMenu">
            <div class="item">Módszertan</div>
            <div class="item">Megosztás</div>
        </div>
    </aside>
</GridItem>
<GridItem variant="main">
    <PollsCardFromData {data} chart_id="fidesz-tisza" />
</GridItem>

<GridItem variant="full">
    <GridSectionTitle>Mandátumbecslés</GridSectionTitle>
</GridItem>

<GridItem variant="left-half" --grid-row="span 2">
    <SectionCard>
        <SectionTitle>Rövid magyarázat</SectionTitle>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt voluptate expedita similique, eaque magni mollitia dicta aperiam pariatur et accusamus iste quidem eius delectus vitae modi fuga error voluptas nisi. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem sunt, eos, eveniet necessitatibus aut doloremque perspiciatis totam adipisci repellat explicabo iusto, consequuntur ullam pariatur officiis nihil minima id natus enim!
        </p>
        <ExplainerCard image="/images/hungary-shape.webp" alt="Választási földrajz">
            A szimuláció azt feltételezi, hogy az EP-választás óta nem változott a választási
            földrajz, de az ellenzéki szavazók nagyobb része szavaz majd a Tiszára.
            <a href="#">Módszertan</a>
        </ExplainerCard>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt voluptate expedita similique, eaque magni mollitia dicta aperiam pariatur et accusamus iste quidem eius delectus vitae modi fuga error voluptas nisi. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem sunt, eos, eveniet necessitatibus aut doloremque perspiciatis totam adipisci repellat explicabo iusto, consequuntur ullam pariatur officiis nihil minima id natus enim!
        </p>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt voluptate expedita similique, eaque magni mollitia dicta aperiam pariatur et accusamus iste quidem eius delectus vitae modi fuga error voluptas nisi. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem sunt, eos, eveniet necessitatibus aut doloremque perspiciatis totam adipisci repellat explicabo iusto, consequuntur ullam pariatur officiis nihil minima id natus enim!
        </p>

        <p>Több szimuláció és ábra, részletesebb adatok, valamint módszertan a <a href="/mandatumbecsles">mandátumbecslés</a> oldalon.</p>
    </SectionCard>
</GridItem>
<GridItem variant="right-half">
    <SectionCard id="parliament-chart">
        <SectionTitle variant="medium">A legvalószínűbb parlament</SectionTitle>
        <p>
            Az alábbi ábrán a <SimulationNameSpan>{data.simulationData["main"]?.metadata.name}</SimulationNameSpan>
            szimuláció országos átlaga és az EP-választás választási földrajza alapján szimulált országgyűlési
            választás eredménye látható.
        </p>
        <ParliamentChart data={data.simulationData} />
        <PartyMandateTable data={data.simulationData["main"]?.seats} />
    </SectionCard>
</GridItem>
<GridItem variant="right-half">
    <SectionCard>
        <SectionTitle variant="medium">Egyéni választókerületek térképe</SectionTitle>
        <p>
            Az alábbi térképen a 106 egyéni választókerület látható, és a 
            <SimulationNameSpan>{data.simulationData["main"]?.metadata.name}</SimulationNameSpan>
            szimuláció által becsült várható különbség a két esélyes párt között.
        </p>
        <OevkMap data={data.simulationData["main"]?.oevkDiffs} />
    </SectionCard>
</GridItem>

<GridItem variant="full">
    <GridSectionTitle>Közvélemény-kutatások</GridSectionTitle>
</GridItem>
<GridItem variant="aside">
    <RecentPollsAside {data} />
</GridItem>
<GridItem variant="main">
    <PollsCardFromData {data} chart_id="all-parties" />
</GridItem>

<GridItem variant="full">
    <GridSectionTitle>Rólunk</GridSectionTitle>
</GridItem>
<GridItem variant="aside">
    <SectionCard>
        <SectionTitle variant="small">Linkek</SectionTitle>
        <ul>
            <li>
                <a href="https://www.facebook.com/valasztasi.kalauz">Választási Kalauz Facebook</a><br>
                A legfrissebb rövidebb posztok a Facebookon.
            </li>
            <li>
                <a href="https://kozvelemeny.org">Közvélemény.org</a><br>
                Hosszabb elemzések a weboldalukon.
            </li>
            <li>
                <a href="https://voxpopuli.444.hu">Vox Populi a 444-en</a><br>
                Válogatott posztok a 444-es blogunkon.
            </li>
        </ul>
    </SectionCard>
</GridItem>
<GridItem variant="main">
    <SectionCard>
        <SectionTitle>Vox Populi</SectionTitle>
        <p>
            A Vox Populi oldal közvélemény-kutatásokkal és (többnyire magyarországi)
            választásokkal kapcsolatos adatokat és elemzéseket közöl pártoktól és pénzbevételtől
            függetlenül, a demokratikus politikai eszmék és gyakorlatok terjesztése mellett
            elkötelezetten. A legfrissebb
            <a href="https://www.facebook.com/valasztasi.kalauz/">rövidebb posztokat itt</a>,
            a hosszabb elemzéseket pedig
            <a href="https://kozvelemeny.wordpress.com/blog-feed/">itt találja meg</a>,
            a jelenleg is aktuális korábbi szövegek javából pedig
            <a href="https://kozvelemeny.org/2022/01/29/orokzold-posztok-a-vox-populin/">itt</a>,
            illetve a 2021. április 2-án indult <a href="https://voxpopuli.444.hu/">https://voxpopuli.444.hu/</a>
            oldalunkon talál egy-egy válogatást.
        </p>
        <SectionTitle variant="small" hasTopMargin>Ki a szerző?</SectionTitle>
        <p>
            Munkaidőben a Közép-Európai Egyetem (CEU) kutatóprofesszora vagyok. Szakterületeim a választói magatartás, a kutatás-módszertan, és a választási rendszerek. 1990 óta foglalkozom ezekkel a témákkal, és azóta kb. 40 tudományos célú kérdőíves vizsgálatot vezettem Lengyelországban, Csehországban, Szlovákiában, Magyarországon és Romániában. Idézettségi adataimat <a href="https://scholar.google.com/citations?user=7mLMXH8AAAAJ&amp;hl=en&amp;oi=ao"> itt</a> találja meg. Első olyan cikkeim, amiben mások közvélemény-kutatásait értékeltem, 1998-ban jelentek meg a nyomtatott <a aria-label="Magyar Hirlapban (opens in a new tab)" href="https://web.archive.org/web/20071112095437/http://www.median.hu/object.7293a708-88dd-4f91-b192-d0853aa7f49a.ivy" target="_blank" rel="noreferrer noopener">Magyar Hirlapban</a> és <a aria-label="másutt (opens in a new tab)" href="http://www.personal.ceu.hu/departs/personal/Gabor_Toka/Papers/Toka99Polls.pdf" target="_blank" rel="noreferrer noopener">másutt</a>. Politikai aktivistaként a Közös Ország Mozgalom taktikai szavazást támogató közvélemény-kutatásain és hétpárti támogatottságú választási törvényjavaslatán, illetve választási megfigyelőként, szavazatszámlálóként, utcai és házról-házra kopogtató kampánymunkásként dolgoztam. Egy pártfüggetlen és szakmabeli ellenzéki aktivista perspektívájából írom tehát, ami itt megjelenik, és az olvasók figyelmén kívül semmit nem fogadok el érte.
        </p>
        <p>@ Tóka Gábor, 2019-</p>
        <SectionTitle variant="small" hasTopMargin>Ki fejlesztette az oldalt?</SectionTitle>
        <p>
            Én.
        </p>
    </SectionCard>
</GridItem>

<style lang="scss">
    #mandate-projection {
        display: flex;
        flex-direction: column;
        height: fit-content;
        padding: 0 1rem;
        padding-bottom: 1rem;
        background-color: #fcfcfc;
        border: 1px solid #eee;

        h2 {
            margin-top: 8px;
            text-align: center;
        }

        p {
            margin-top: 12px;
        }

        .visualization {
            width: 100%;
            margin: 0 auto;
            padding: 1rem 0;
        }
        .bottomMenu {
            margin-top: 1rem;
            display: flex;
            gap: 6px;

            .item {
                font-size: 14px;
                padding: 3px 6px;
                border: 1px solid #eee;
                border-radius: 2px;
                cursor: pointer;

                a {
                    text-decoration: none;
                }
            }
        }
    }

    ul {
        list-style-type: none;
        padding: 0;

        li {
            margin-bottom: 6px;
            font-size: 1rem;

            a {
                color: #3396ff;
            }
        }
    }

    h2 {
        font-size: 22px;
        font-weight: 400;
    }

    h3 {
        margin-top: 16px;
        font-size: 22px;
        font-weight: 400;
    }

    p {
        margin-top: 12px;
    }
</style>
