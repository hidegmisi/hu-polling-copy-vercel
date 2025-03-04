<script lang="ts">
    // get the chartId from the slug parameter
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import {
        pollData,
        fetchData,
    } from "$stores/dataStore";
    import type { PollData } from "$lib/types";
    import PollsCardFromData from "$components/poll/PollsCardFromData.svelte";
    import html2canvas from "html2canvas";

    const chartId = page.params.chartId;

    let data = {
        sure_voters: [] as PollData,
        all_voters: [] as PollData,
    };

    onMount(fetchData);

    $: data = $pollData;

    function saveImage() {
        const element = document.querySelector(".pollGraph");
        if (!element) {
            console.error("Element not found");
            return;
        }

        html2canvas(element)
            .then((canvas) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error("Blob not created");
                        return;
                    }
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download =
                        chartId + "-vox-populi-valasztas-2026" + ".png";
                    link.click();
                });
            })
            .catch((err) => console.error("Error capturing element", err));
    }

    // Copies the current page URL to the clipboard
    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        } catch (err) {
            console.error("Error copying link:", err);
        }
    }
</script>

<article>
    <PollsCardFromData {data} chart_id={page.params.chartId} showSource={true} />
</article>
<aside>
    <h1>Megosztás</h1>
    <ul>
        <li>
            <button type="button" on:click={copyLink}>Link másolása</button>
        </li>
        <li>
            <button type="button" on:click={saveImage}>Mentés képként</button>
        </li>
        <li>
            <button type="button" on:click={null}>Beágyazás</button>
        </li>
    </ul>
</aside>

<style lang="scss">
    :global(.pollGraph .bottomMenu) {
        display: none !important;
    }

    article {
        grid-column: 1 / 4;
    }

    aside {
        display: flex;
        flex-direction: column;
        height: fit-content;
        padding: 0 1rem;
        padding-bottom: 1rem;
        background-color: #fcfcfc;
        border: 1px solid #eee;

        h1 {
            font-size: 22px;
            font-weight: 400;
            margin-top: 8px;
            text-align: center;
        }

        ul {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 1rem;
            list-style: none;

            li {
                button {
                    width: 100%;
                    padding: 4px 8px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                    cursor: pointer;
                    background-color: #fff;
                    font-weight: 400;
                    text-align: left;
                }
            }
        }
    }
</style>
