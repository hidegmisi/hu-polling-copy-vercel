<script lang="ts">
    import type { PollData } from "$lib/types";
    import { onMount } from "svelte";
    import { pollData, fetchData } from "../../stores/dataStore";
    import InteractivePollsCard from "../../components/InteractivePollsCard.svelte";
    import RecentPollsAside from "../../components/RecentPollsAside.svelte";
    import PollsCardFromData from "../../components/PollsCardFromData.svelte";

    let data: Record<'sure_voters' | 'all_voters', PollData> = {
        sure_voters: [],
        all_voters: [],
    };

    let articleMap = {
        0: "az",
        1: "a\xa0",
        2: "a\xa0",
        3: "az",
    }

    onMount(fetchData);

    $: data = $pollData;
</script>

<div id="interactive-polls">
    <InteractivePollsCard
        {data}
        description="A közvélemény-kutatások eredményei alapján a következő mandátumokat kapnák a pártok az Országgyűlésben."
        selectedParties={["fidesz", "tisza"]}
        dateRange={undefined}
        annotations={[]}
        voterType="sure_voters"
        pollsterGroup="összes"
        featured
    />
</div>
<div class="sectionTitle">
    <h2>Közvélemény-kutatások</h2>
</div>
<RecentPollsAside {data} />
<div id="fidesz-tisza">
    <PollsCardFromData {data} chart_id="fidesz-tisza" />
</div>
<aside></aside>
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
    .bodyContainer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 700px;
        line-height: 1.4;
        border: 1px dashed blue;
        border-top: none;
    }

    article {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        padding: 8px 16px;
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


    h1 {
        font-size: 1.8rem;
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

        #interactive-polls {
            grid-column: 1 / 3;
        }

        #fidesz-tisza {
            grid-column: 2 / 3;
        }

        #all-parties {
            grid-column: 1 / 3;
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

        #interactive-polls {
            grid-column: 1 / 5;
        }

        #fidesz-tisza {
            grid-column: 2 / 5;
        }

        #all-parties {
            grid-column: 1 / 4;
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
