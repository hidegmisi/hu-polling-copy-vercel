<script lang="ts">
    import type { PollData, Simulation } from "$lib/types";
    import { onMount } from "svelte";
    import {
        pollData,
        simulationData,
        fetchData,
        pollsterGroups,
    } from "../stores/dataStore";
    import RecentPollsAside from "../components/RecentPollsAside.svelte";
    import MiniMandateProjection from "../components/MiniMandateProjection.svelte";
    import PollsCardFromData from "../components/PollsCardFromData.svelte";

    let data = {
        sure_voters: [] as PollData,
        all_voters: [] as PollData,
        simulationData: {} as Record<string, Simulation>,
    };

    let mandateProjectionOptions = {
        pollsterGroupIndex: 0 as 0 | 1 | 2,
    };

    let articleMap = {
        0: "az",
        1: "a\xa0",
        2: "a\xa0",
        3: "az",
    };

    onMount(fetchData);

    $: data = {
        sure_voters: $pollData.sure_voters,
        all_voters: $pollData.all_voters,
        simulationData: $simulationData,
    }
</script>

<aside id="mandate-projection">
    <h2>Mandátumbecslés</h2>
    <!-- <p>
        A Fidesz és a Tisza parlamenti képviselőinek várható száma.
    </p> -->
    <p>
        Képviselők várható aránya {articleMap[
            mandateProjectionOptions.pollsterGroupIndex
        ]}
        <select bind:value={mandateProjectionOptions.pollsterGroupIndex}>
            {#each pollsterGroups as group, i}
                <option value={i}>{group}</option>
            {/each}
        </select>
        közvélemény-kutató{!mandateProjectionOptions.pollsterGroupIndex
            ? ""
            : "k"} adatai alapján:
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
<div id="fidesz-tisza">
    <PollsCardFromData {data} chart_id="fidesz-tisza" />
</div>
<div class="sectionTitle">
    <h2>Közvélemény-kutatások</h2>
</div>
<RecentPollsAside {data} />
<div id="all-parties">
    <PollsCardFromData {data} chart_id="all-parties" />
</div>
<PollsCardFromData {data} chart_id="kiabrandult-fideszesek" />
<section id="polls-description" class="bodyContainer">
    <h2>Nem tudom, hogy mi lehet itten</h2>
</section>
<PollsCardFromData {data} chart_id="ellenzek-2022-ota" />
<aside></aside>

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
            font-size: 22px;
            font-weight: 400;
            margin-top: 8px;
            text-align: center;
        }

        p {
            margin-top: 12px;
        }

        .visualization {
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

    .sectionTitle {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
        border-top: 1px solid #eee;
        padding-top: 12px;

        h2 {
            font-weight: 400;
        }
    }

    #polls-description {
        padding: 8px 1rem;
        border: 1px dashed #ddd;

        h2 {
            text-align: left;
            font-size: 22px;
            font-weight: 400;
        }

        p {
            margin-top: 12px;
        }
    }

    .bodyContainer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 700px;
        line-height: 1.4;
        border: 1px dashed #ddd;
        border-top: none;
    }

    article {
        width: 100%;
        margin: 0 auto;
        padding: 8px 16px;
    }

    h1 {
        font-size: 2rem;
        font-weight: 500;
    }

    h2 {
        font-size: 22px;
        font-weight: 500;
        text-align: center;
    }

    p {
        font-size: 16px;
        margin-top: 12px;
    }

    @media (min-width: 600px) {
        .sectionTitle {
            grid-column: 1 / 3;
        }

        #fidesz-tisza,
        #all-parties {
            grid-column: 2 / 3;
        }

        #polls-description {
            grid-column: 2 / 3;
            grid-row: span 2;
        }

        .poll-graph {
            grid-column: span 1;
            grid-row: span 1;
        }
    }

    @media (min-width: 800px) {
        .sectionTitle {
            grid-column: 1 / 5;
        }

        #fidesz-tisza,
        #all-parties {
            grid-column: 2 / 5;
        }

        #polls-description {
            grid-column: 3 / 5;
            grid-row: span 2;
        }

        .poll-graph {
            grid-column: span 2;
            grid-row: span 1;
        }
    }
</style>
