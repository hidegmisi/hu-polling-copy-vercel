<script lang="ts">
    import type { PollData } from "$lib/types";
    import RecentPollCard from "./RecentPollCard.svelte";

    export let data: Record<'sure_voters' | 'all_voters', PollData> = { sure_voters: [], all_voters: [] };
    let selectedIndex = 'sure_voters' as 'sure_voters' | 'all_voters';
</script>

<aside id="recent-polls">
    <h2>A legfrissebb adatok</h2>
    <p>
        Az összes 2018-óta végzett országos közvélemény-kutatás eredménye
        megtalálható az <a href="//kozvelemeny.org" target="_blank"
            >oldalunkon</a
        >.
    </p>
    <div class="categSwitch">
        <button class:active={selectedIndex == 'sure_voters'} on:click={() => selectedIndex = 'sure_voters'} >Biztos szavazók</button>
        <button class:active={selectedIndex == 'all_voters'} on:click={() => selectedIndex = 'all_voters'} >Választókorúak</button>
    </div>
    <section class="pollsContainer">
        {#each data[selectedIndex]?.slice(0, 5) as poll}
            <RecentPollCard {poll} />
        {/each}
    </section>
</aside>

<style lang="scss">
#recent-polls {
    padding: 0 8px;
    border: 1px solid #eee;
    background-color: #fcfcfc;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        text-align: center;
        margin-top: 12px;
        font-weight: 400;
        font-size: 20px;
    }

    p {
        margin-top: 12px;
        text-align: center;
    }

    .categSwitch {
        display: grid;
        grid-template-columns: repeat(2, minmax(100px, 1fr));
        gap: 6px;
        margin-top: 1rem;
        
        button {
            padding: 2px 4px;
            border: 1px solid #eee;
            background-color: #fff;
            border-radius: 4px;
            color: #666;

            &.active {
                border-color: #ccc;
                color: #333;
            }
        }
    }

    .pollsContainer {
        width: 100%;
        padding: 12px 0;

        display: flex;
        flex-direction: column;
        gap: 6px;
    }
}
</style>