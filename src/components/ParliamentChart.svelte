<script>
    import ParliamentChart from "$lib/parliament-chart/ParliamentChart";
    import { onMount } from "svelte";
    import { partyData } from "../stores/dataStore";

    let chart;

    onMount(() => {
        chart = new ParliamentChart("#chart", {
            width: 600,
            height: 350,
            seatRadius: 7,
            seatPadding: 4,
            // You can adjust these as needed.
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
        });
        chart.update([
            { name: "Tisza", color: partyData["tisza"].color, seats: 101 },
            { name: "Fidesz", color: partyData["fidesz"].color, seats: 83 },
            { name: "dk_mszp_p", color: partyData["dk_mszp_p"].color, seats: 9 },
            { name: "mihazank", color: partyData["mihazank"].color, seats: 6 },
        ]);
    });
</script>

<article>
    <div id="chart"></div>
    <div class="chartInfos">
        <img src="/images/candidate/tisza.png" alt="Tisza" class="tisza" />
        <div class="results">
            <h3>51%</h3>
        </div>
        <hr>
        <div class="results">
            <h3>42%</h3>
        </div>
        <img src="/images/candidate/fidesz.png" alt="Fidesz" class="fidesz" />
    </div>
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

            &.tisza {
                background-color: #00359c66;
            }
            &.fidesz {
                background-color: #fd810066;
            }
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
