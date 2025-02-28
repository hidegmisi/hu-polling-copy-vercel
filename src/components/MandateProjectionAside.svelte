<script lang="ts">
    import type { Simulation } from "$lib/types";
    import { createEventDispatcher, onMount } from "svelte";

    export let data = {} as Record<string, Simulation>;

    let selectedSimulation = "main";

    const dispatch = createEventDispatcher();

    function selectSimulation(simulation: string) {
        selectedSimulation = simulation;
        dispatch("selectSimulation", simulation);
    }
</script>

<aside id="mandate-projection">
    <h2>Mandátumbecslés</h2>
    <p>
        Az EP-választás választási földrajzából kiindulva,
        az alábbi adatok alapján:
    </p>
    <div class="simulations">
        {#each Object.keys(data) as key}
            <button
                type="button"
                on:click={() => selectSimulation(key)}
                class:selected={selectedSimulation === key}
            >
                <h3>{data[key].metadata.name}</h3>
                <p>
                    {data[key].metadata.description}
                </p>
            </button>
        {/each}
    </div>
    <div class="bottomMenu">
        <div class="item">Módszertan</div>
    </div>
</aside>

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

        .simulations {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem 0;

            button {
                text-align: left;
                padding: 8px 6px;
                border: 1px solid #eee;
                border-radius: 4px;
                background-color: #f9f9f9;
                cursor: pointer;

                &.selected {
                    padding: 7px 5px;
                    border-width: 2px;
                    border-color: #6de635;
                    
                    h3 {
                        font-weight: 400;
                    }
                }

                h3 {
                    margin: 0;
                    font-weight: 300;
                    font-size: 1rem;
                }

                p {
                    margin-top: 3px;
                }
            }
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
</style>
