<script lang="ts">
    import ParliamentChart from "$lib/parliament-chart/ParliamentChart";
    import { onMount } from "svelte";
    import { partyData } from "../stores/dataStore";
    import type { Party, Simulation } from "$lib/types";

    export let data = {} as Record<string, Simulation>;

    let chart;
    let chartData = [] as { id: Party, name: string; color: string; seats: number }[];

    onMount(() => {
        const loadingInterval = setInterval(() => {
            if (Object.keys(partyData).length && data.main.medians) {
                clearInterval(loadingInterval);
                drawChart();
            }
        }, 10);
    });

    function drawChart() {
        chart = new ParliamentChart("#chart", {
            width: 600,
            height: 350,
            seatRadius: 7,
            seatPadding: 4,
            // You can adjust these as needed.
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
        });
        
        for (const party of (["fidesz", "tisza", "mihazank", "dk_mszp_p", "mkkp"] as (keyof typeof partyData)[]) ) {
            chartData.push({
                id: party,
                name: partyData[party].name,
                color: partyData[party].color,
                seats: data.main.medians[party],
            });
        }

        chartData.sort((a, b) => b.seats - a.seats);
        chart.update(chartData)

        chartData = [...chartData];
    }

</script>

<article>
    <div id="chart"></div>
    {#if chartData.length}
    <div class="chartInfos">
        <img src="/images/candidate/{chartData[0].id}.png" alt={chartData[0].name} style={`background-color: ${chartData[0].color}66`} />
        <div class="results">
            <h3>{Math.round(chartData[0].seats / 199 * 100)}%</h3>
        </div>
        <hr>
        <div class="results">
            <h3>{Math.round(chartData[1].seats / 199 * 100)}%</h3>
        </div>
        <img src="/images/candidate/{chartData[1].id}.png" alt={chartData[1].name} style={`background-color: ${chartData[1].color}66`} />
    </div>
    {/if}
</article>

<style lang="scss">
    .chartInfos {
        position: relative;
        max-width: 210px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: -64px - 16px;
        margin-bottom: 16px;
        padding: 6px;
        border-radius: 120px;
        background-color: #f5f5f5;
        border: 1px solid #eee;
        z-index: 2;

        img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
        }

        .results {
            text-align: left;
            flex-grow: 1;
            padding: 0 6px;
            display: flex;
            flex-direction: column;

            &:nth-of-type(2) {
                text-align: right;
            }
            
            p {
                margin-top: 0;
            }
        }


        hr {
            width: 0;
            height: 36px;
            border: 1px solid #eee;
        }

        .textContainer {
            align-items: center;
            padding: 0 8px;

            h2#leaderText {
                font-size: 0.9rem;
                font-weight: 600;
                padding: 2px 3px;
                padding-bottom: 0;
            }
            .standing {
                font-size: 0.75rem;
                text-align: center;

                span {
                    background: none;
                    padding: 0;
                }
            }
        }
    }
</style>
