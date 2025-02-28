<script lang="ts">
    import type { Party } from "$lib/types";
    import { partyData } from "../stores/dataStore";

    export let data = {} as Record<Party, number>;
</script>

<section class="mandateTable">
    {#each Object.keys(data).sort((a, b) => data[b] - data[a]) as party, i}
        <article>
            <header>
                <div
                    class="dot"
                    style="
                        background-color: {partyData[party as Party].color}33;
                        border: 1px solid {partyData[party as Party].color};
                    "
                ></div>
                <h3>{partyData[party as Party].name}</h3>
                <!-- <div class="imgContainer">
                    <img src={`/images/party-logo/${party}.png`} alt={partyData[party as Party].name} />
                </div> -->
                <div class="percentage">
                    {(data[party as Party] / 199 * 100).toFixed(0)}%
                </div>
            </header>
            <p>{data[party as Party]} mandátum</p>
        </article>
        <!-- {#if i < Object.keys(data).length - 1}
            <div class="divider"></div>
        {/if} -->
    {/each}
</section>

<style lang="scss">
    .mandateTable {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
        padding: 0 12px;

        article {
            display: flex;
            align-items: start;
            flex-direction: column;
            gap: 6px;
            padding: 12px;
            border: 1px solid #eee;
            //border-radius: 4px;

            header {
                display: flex;
                align-items: center;
                gap: 6px;
                width: 100%;

                .dot {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                }
                
                h3 {
                    font-size: 1rem;
                    font-weight: 400;
                }
            }


            .percentage {
                margin-left: auto;
                font-size: 1rem;
                font-weight: 400;
            }

            .imgContainer {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 24px;
                height: 24px;
                
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