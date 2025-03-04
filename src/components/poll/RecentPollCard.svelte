<script lang="ts">
    import type { Poll } from "$lib/types";
    import { pollsterData } from "$stores/dataStore";
    
    export let poll: Poll;

    let pollData = {
        date: new Date(),
        dateDisplay: "",
        fidesz: 0,
        fideszDisplay: 0,
        tisza: 0,
        tiszaDisplay: 0,
        leader: "",
    };

    $: {
        poll.fidesz = poll.fidesz ?? 0;
        poll.tisza = poll.tisza ?? 0;

        pollData = {
            date: poll.date,
            dateDisplay: new Date(poll.date).toLocaleDateString("hu-HU", {
                month: "short",
                day: "numeric",
            }),
            fidesz: poll.fidesz,
            fideszDisplay: Number((poll.fidesz * 100).toFixed(0)),
            tisza: poll.tisza,
            tiszaDisplay: Number((poll.tisza * 100).toFixed(0)),
            leader: poll.fidesz > poll.tisza ? "fidesz" : "tisza",
        }
    }
</script>

<a href={poll.url} target="_blank"><article>
    <header>
        <div class="pollster">
            {pollsterData[poll.pollster]?.name ?? poll.pollster}
        </div>
        <div class="date">
            {pollData.dateDisplay} 
        </div>
    </header>
    {#if pollData.fidesz || pollData.tisza}
    <section>
        {#if pollData.leader === "fidesz"}
            <div class="result fidesz" style="width: {pollData.fideszDisplay * 1.5}%;">{pollData.fideszDisplay}</div>
            <div class="result tisza" style="width: {pollData.tiszaDisplay * 1.5}%;">{pollData.tiszaDisplay}</div>
        {:else}
            <div class="result tisza" style="width: {pollData.tiszaDisplay * 1.5}%;">{pollData.tiszaDisplay}</div>
            <div class="result fidesz" style="width: {pollData.fideszDisplay * 1.5}%;">{pollData.fideszDisplay}</div>
        {/if}
    </section>
    {/if}
</article></a>

<style lang="scss">
    a {
        text-decoration: none;
        color: inherit;
    }
    article {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        border: 1px solid #eee;
        padding: 6px;
        border-radius: 4px;
    }

    header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .date, .pollster {
            font-size: 14px;
        }

        .date {
            color: #888;
        }
    }

    section {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;

        .result {
            padding: 2px 4px;
            text-align: center;
            color: white;
            flex-grow: 1;
            font-size: 12px;
            font-weight: 400;
            
            &.fidesz {
                background-color: #fd8100;
                text-align: right;
            }
            
            &.tisza {
                background-color: #00359c;
                text-align: right;
            }
        }
    }

</style>