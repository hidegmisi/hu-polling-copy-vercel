<script lang="ts">
    // get the chartId from the slug parameter
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { pollData, fetchData } from "$stores/dataStore";
    import type { PollData } from "$lib/types";
    import PollsCardFromData from "$components/poll/PollsCardFromData.svelte";
    import html2canvas from "html2canvas";
    import GridItem from "$components/grid/GridItem.svelte";
    import SectionCard from "$components/section/SectionCard.svelte";
    import SectionTitle from "$components/section/SectionTitle.svelte";

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

        html2canvas(element as HTMLElement)
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
            alert(`Link másolva a vágólapra! (${window.location.href})`);
        } catch (err) {
            console.error("Error copying link:", err);
        }
    }

    async function copyEmbedCode(link: string) {
        if (!link.includes("http")) {
            link = window.location.origin + link;
        }

        const embedCode = `
            <iframe
                src="${link}"
                width="100%"
                style="
                    aspect-ratio: 30 / 22;
                    border: none;
                "
            ></iframe>`;

        try {
            await navigator.clipboard.writeText(embedCode);
            alert("Beágyazási kód másolva a vágólapra!");
        } catch (err) {
            console.error("Error copying embed code:", err);
        }
    }
</script>

<GridItem variant="left-main" --grid-row="1 / 3">
    <PollsCardFromData
        {data}
        chart_id={page.params.chartId}
        showSource={true}
        featured={true}
    />
</GridItem>

<GridItem variant="right-aside">
    <SectionCard>
        <SectionTitle variant="small">Megosztás</SectionTitle>
        <div class="share-menu">
            <ul>
                <li>
                    <button type="button" on:click={copyLink}>Link másolása</button>
                </li>
                <li>
                    <button type="button" on:click={saveImage}>Mentés képként</button>
                </li>
                <li>
                    <button
                        type="button"
                        on:click={() => copyEmbedCode(`/abra/${chartId}/embed`)}
                    >
                        Kártya beágyazása
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        on:click={() => copyEmbedCode(`/abra/${chartId}/embed?chart_only=true`)}
                    >
                        Grafikon beágyazása
                    </button>
            </ul>
        </div>
    </SectionCard>
</GridItem>
<GridItem variant="right-aside">
    <SectionCard>
        <SectionTitle variant="small">A blogunkról</SectionTitle>
        <ul class="related-posts">
            <li>
                <a href="https://kozvelemeny.org/2025/01/30/mikent-ne-becsuljunk-parlamenti-mandatummegoszlast-illusztracio-a-nezopont-becslesei-alapjan/">
                    <h3>Miként (ne) becsüljünk parlamenti mandátummegoszlást?
                        Illusztráció a Nézőpont becslései alapján</h3>
                </a>
            </li>
        </ul>
    </SectionCard>
</GridItem>

<style lang="scss">
    .share-menu {
        ul {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 6px;
            list-style: none;

            li {
                button {
                    width: 100%;
                    padding: 4px 8px;
                    border: 1px solid #f5f5f5;
                    border-radius: 4px;
                    cursor: pointer;
                    background-color: #f9f9f9;
                    font-weight: 400;
                    text-align: left;
                }
            }
        }
    }

    ul.related-posts {
        list-style-type: disc;
        padding-left: 16px;

        li {
            a {
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
            h3 {
                font-size: 1rem;
                font-weight: 400;
            }
        }
    }
</style>
