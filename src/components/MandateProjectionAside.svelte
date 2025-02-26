<script lang="ts">
    import MiniMandateProjection from "./MiniMandateProjection.svelte";
    import {
        pollsterGroups,
    } from "../stores/dataStore";
    import type { Simulation } from "$lib/types";

    export let data = {} as Record<string, Simulation>;

    let mandateProjectionOptions = {
        pollsterGroupIndex: 0 as 0 | 1 | 2,
    };

    let articleMap = {
        0: "az",
        1: "a\xa0",
        2: "a\xa0",
        3: "az",
    };
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
            <MiniMandateProjection {data} />
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
</style>
