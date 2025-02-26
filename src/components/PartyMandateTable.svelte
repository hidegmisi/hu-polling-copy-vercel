<script lang="ts">
    import type { Party } from "$lib/types";
    import { partyData } from "../stores/dataStore";

    export let data = {} as Record<Party, number>;
</script>

<section class="mandateTable">
    {#each Object.keys(data).sort((a, b) => data[b] - data[a]) as party, i}
        <article>
            <div class="imgContainer">
                <img src={`/images/party-logo/${party}.png`} alt={partyData[party as Party].name} />
            </div>
            <h3>{partyData[party as Party].name}</h3>
            <div class="percentage">
                {(data[party as Party] / 199 * 100).toFixed(0)}%
            </div>
            <p>{data[party as Party]} mandátum</p>
        </article>
        {#if i < Object.keys(data).length - 1}
            <div class="divider"></div>
        {/if}
    {/each}
</section>

<style lang="scss">
    .mandateTable {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1rem 0;
        padding: 0 12px;
        background-color: #f9f9f9;
        border: 2px solid #f5f5f5;

        article {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            min-width: 100px;
            flex-grow: 1;
            padding: 1rem 0;

            h3 {
                font-size: 18px;
                font-weight: 400;
            }

            .percentage {
                margin: 6px 0;
                font-size: 2rem;
                font-weight: 400;
            }

            .imgContainer {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 32px;
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
        }

        .divider {
            width: 2px;
            background-color: #f5f5f5;
        }
    }
</style>