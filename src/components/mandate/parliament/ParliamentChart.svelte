<script lang="ts">
    import ParliamentChart from "$lib/parliament-chart/ParliamentChart";
    import { onMount } from "svelte";
    import { partyData } from "$stores/dataStore";
    import type { Party, Simulation } from "$lib/types";

    export let data = {} as Record<string, Simulation>;
    export let selectedSimulation = "main";

    let chart: ParliamentChart | null = null;
    let chartData = [] as {
        id: Party;
        name: string;
        color: string;
        seats: number;
    }[];
    let orderedChartData = [] as {
        id: Party;
        name: string;
        color: string;
        seats: number;
    }[];

    onMount(() => {
        const loadingInterval = setInterval(() => {
            if (
                Object.keys(partyData).length &&
                data[selectedSimulation]?.medians
            ) {
                clearInterval(loadingInterval);
                drawChart(data[selectedSimulation]);
            }
        }, 10);
    });

    $: {
        if (chart) {
            drawChart(data[selectedSimulation]);
        }
    }

    function drawChart(simulation: Simulation) {
        if (!chart) {
            chart = new ParliamentChart("#chart svg", {
                width: 600,
                height: 350,
                seatRadius: 7,
                seatPadding: 4,
                // You can adjust these as needed.
                margin: { top: 20, right: 20, bottom: 20, left: 20 },
            });
        } else {
            chartData = [];
        }

        const partyOrder =
            simulation.seats["fidesz"] > simulation.seats["tisza"]
                ? [
                      "fidesz",
                      "minority",
                      "mihazank",
                      "dk_mszp_p",
                      "mkkp",
                      "tisza",
                  ]
                : [
                      "tisza",
                      "mkkp",
                      "dk_mszp_p",
                      "mihazank",
                      "minority",
                      "fidesz",
                  ];

        for (const party of partyOrder as (keyof typeof partyData)[]) {
            chartData.push({
                id: party,
                name: partyData[party].name,
                color: partyData[party].color,
                seats: simulation.seats[party] ?? 1,
            });
        }

        chart.update(chartData);

        chartData = [...chartData];

        orderedChartData = chartData.sort((a, b) => b.seats - a.seats);
    }
</script>

<article>
    <div id="chart">
        <svg></svg>
    </div>
    {#if orderedChartData.length}
        <div class="chartInfos">
            <img
                src="/images/candidate/{orderedChartData[0].id}.png"
                alt={orderedChartData[0].name}
                style={`background-color: ${orderedChartData[0].color}66`}
            />
            <div class="results">
                <h3>{Math.round((orderedChartData[0].seats / 199) * 100)}%</h3>
            </div>
            <hr />
            <div class="textContainer">
                <h3>Győztes:</h3>
                <div class="standing">
                    {#if orderedChartData[0].seats / 199 < 0.5}
                        Nincs többség
                    {:else if orderedChartData[0].seats / 199 < 0.66}
                        {orderedChartData[0].name} többség
                    {:else}
                        {orderedChartData[0].name} kétharmad
                    {/if}
                </div>
            </div>
            <hr />
            <div class="results">
                <h3>{Math.round((orderedChartData[1].seats / 199) * 100)}%</h3>
            </div>
            <img
                src="/images/candidate/{orderedChartData[1].id}.png"
                alt={orderedChartData[1].name}
                style={`background-color: ${orderedChartData[1].color}66`}
            />
        </div>
    {/if}
</article>

<style lang="scss">
    .chartInfos {
        position: relative;
        /* max-width: 210px; */
        max-width: fit-content;
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
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }

        .results {
            text-align: left;
            flex-grow: 1;
            padding: 0 6px;
            display: flex;
            flex-direction: column;

            h3 {
                font-size: 1rem;
                font-weight: 600;

                &:nth-of-type(2) {
                    text-align: right;
                }
            }
        }

        hr {
            width: 0;
            height: 32px;
            border: 0.5px solid #eee;
        }

        .textContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 8px;
            display: none;

            h3 {
                font-size: 14px;
                font-weight: 600;
                padding: 2px 3px;
                padding-bottom: 0;
            }
            .standing {
                font-size: 12px;
                text-align: center;
            }
        }
    }

    @media (min-width: 360px) {
        .chartInfos {
            .textContainer {
                display: flex;
            }
            hr {
                border-width: 1px;
            }
        }
    }
</style>
