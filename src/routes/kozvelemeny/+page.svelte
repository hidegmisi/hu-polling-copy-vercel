<script lang="ts">
    import type { PollData } from "$lib/types";
    import { onMount } from "svelte";
    import { pollData, fetchData } from "$stores/dataStore";
    import InteractivePollsCard from "$components/poll/InteractivePollsCard.svelte";
    import RecentPollsAside from "$components/poll/RecentPollsAside.svelte";
    import PollsCardFromData from "$components/poll/PollsCardFromData.svelte";
    import GridItem from "$components/grid/GridItem.svelte";
    import GridSectionTitle from "$components/grid/GridSectionTitle.svelte";
    import SectionCard from "$components/section/SectionCard.svelte";
    import SectionTitle from "$components/section/SectionTitle.svelte";

    let data: Record<"sure_voters" | "all_voters", PollData> = {
        sure_voters: [],
        all_voters: [],
    };

    onMount(fetchData);

    $: data = $pollData;
</script>

<GridItem variant="full">
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
</GridItem>
<GridSectionTitle>A két esélyes</GridSectionTitle>
<GridItem variant="aside">
    <RecentPollsAside {data} />
</GridItem>
<GridItem variant="main">
    <PollsCardFromData {data} chart_id="fidesz-tisza" />
</GridItem>
<GridItem variant="left-half">
    <PollsCardFromData {data} chart_id="kiabrandult-fideszesek" />
</GridItem>
<GridItem variant="right-half">
    <SectionCard>
        <SectionTitle>Valami szöveg</SectionTitle>
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe ea
            excepturi harum eaque consectetur? Quae eum qui distinctio quibusdam
            libero mollitia temporibus in consectetur, magnam autem quisquam
            adipisci! Autem, deleniti?
        </p>
        <p>
            Amet consectetur adipisicing elit. Dignissimos, nemo voluptate,
            quos, quas quia quae quidem quibusdam doloremque voluptatum quod
            doloribus aut fugit. Corporis quidem, quas quos quae quibusdam
            doloremque voluptatum quod doloribus aut fugit.
        </p>
    </SectionCard>
</GridItem>
<GridSectionTitle>A többi párt</GridSectionTitle>
<GridItem variant="full">
    <PollsCardFromData {data} chart_id="all-parties-wide" />
</GridItem>
<GridItem variant="left-half">
    <PollsCardFromData {data} chart_id="ellenzek-2022-ota" />
</GridItem>
<GridItem variant="right-half">
    <SectionCard>
        <SectionTitle>Valami szöveg</SectionTitle>
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe ea
            excepturi harum eaque consectetur? Quae eum qui distinctio quibusdam
            libero mollitia temporibus in consectetur, magnam autem quisquam
            adipisci! Autem, deleniti?
        </p>
        <p>
            Amet consectetur adipisicing elit. Dignissimos, nemo voluptate,
            quos, quas quia quae quidem quibusdam doloremque voluptatum quod
            doloribus aut fugit. Corporis quidem, quas quos quae quibusdam
            doloremque voluptatum quod doloribus aut fugit.
        </p>
    </SectionCard>
</GridItem>

<style lang="scss">
    p {
        margin-top: 12px;
    }
</style>
