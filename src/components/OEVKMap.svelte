<script lang="ts">
    import { onMount } from "svelte";
    import mapboxgl, { type LngLatBoundsLike } from "mapbox-gl";
    import { partyData } from "../stores/dataStore";
    import type { Simulation } from "$lib/types";

    export let data = {} as Simulation["oevkDiffs"];

    let map: mapboxgl.Map;
    let mapLoaded = false;
    let geojsonData: GeoJSON.FeatureCollection;
    let oevkLayerId = "oevks";
    let oevkLayerIncrement = 0;

    const MAPBOX_ACCESS_TOKEN =
        "pk.eyJ1IjoiaGlkZWdtaXNpIiwiYSI6ImNrNmx5YzlwODBpbjEzbnA3d216cTRjcXAifQ.0Fvgxohx9xZmb-14mcC71g";
    const hungaryBounds = [
        [15.113, 45.737 - 0.1],
        [23.896, 48.585 + 0.3],
    ] as LngLatBoundsLike;

    // Updates the arrow on the legend based on diff value,
    // snapping to the center of the corresponding discrete category.
    function updateLegendArrow(diff: any) {
        const diffValue = parseFloat(diff);
        let position: number;
        let category: string;
        let textColor: string;
        let opacity: number;

        if (diffValue < -0.15) {
            position = 10;
            category = "Fidesz +15%";
            textColor = partyData["fidesz"].color;
            opacity = 1;
        } else if (diffValue < -0.05) {
            position = 30;
            category = "Fidesz +5%";
            textColor = partyData["fidesz"].color;
            opacity = 0.2;
        } else if (diffValue < 0.05) {
            position = 50;
            category = "Szoros";
            textColor = "#fff";
            opacity = 0.2;
        } else if (diffValue < 0.15) {
            position = 70;
            category = "Tisza +5%";
            textColor = partyData["tisza"].color;
            opacity = 0.2;
        } else {
            position = 90;
            category = "Tisza +15%";
            textColor = partyData["tisza"].color;
            opacity = 1;
        }

        const arrow = document.getElementById("colorbar-arrow");
        const label = document.getElementById("colorbar-label");
        const text = label?.querySelector("text");

        if (arrow) {
            arrow.style.left = position + "%";
            arrow.style.display = "block";
        }
        if (label && text) {
            label.style.left = position + "%";
            label.style.display = "block";
            text.innerHTML = category;
            text.style.fill = '#333';
        }
    }

    $: if (map && data) {
        const loadingInterval = setInterval(() => {
            if (mapLoaded) {
                clearInterval(loadingInterval);
                loadGeoJSON();
            }
        }, 1000);
    }

    async function loadGeoJSON() {
        if (!data || !map || !mapLoaded) return;

        const layers = map.getStyle()?.layers;
        let firstSymbolId;
        if (layers) {
            for (const layer of layers) {
                if (layer.type === "symbol") {
                    firstSymbolId = layer.id;
                    break;
                }
            }
        } else {
            firstSymbolId = "country-label";
        }

        if (!geojsonData) {
            const response = await fetch("/geo/oevks.geojson");
            geojsonData = await response.json();

            map.addLayer(
                {
                    id: "oevk-lines",
                    type: "line",
                    source: {
                        type: "geojson",
                        data: geojsonData,
                    },
                    paint: {
                        "line-width": 2,
                        "line-color": "#000",
                        "line-opacity": 0.21,
                    },
                },
                firstSymbolId,
            );
        }

        // Add the diff property to each feature
        for (let feature of geojsonData.features) {
            if (!feature.properties) continue;
            feature.properties.diff = data[feature.properties?.OEVK] ?? 0;
        }

        console.log(geojsonData);
        

        // Remove previous OEVK layer if it exists
        if (map.getLayer(oevkLayerId + oevkLayerIncrement)) {
            map.removeLayer(oevkLayerId + oevkLayerIncrement);
        }
        oevkLayerIncrement++;

        // Use a discrete (step) expression for the fill-color:
        // - diff < -0.15: "15+ fidesz"
        // - -0.15 <= diff < -0.05: "5+ fidesz"
        // - -0.05 <= diff < 0.05: "tossup"
        // - 0.05 <= diff < 0.15: "5+ tisza"
        // - diff >= 0.15: "15+ tisza"
        map.addLayer(
            {
                id: oevkLayerId + oevkLayerIncrement,
                type: "fill",
                source: {
                    type: "geojson",
                    data: geojsonData,
                },
                paint: {
                    "fill-color": [
                        "step",
                        ["get", "diff"],
                        partyData["fidesz"].color,
                        -0.15,
                        partyData["fidesz"].color,
                        -0.05,
                        "#ffffff",
                        0.05,
                        partyData["tisza"].color,
                        0.15,
                        partyData["tisza"].color,
                    ],
                    "fill-opacity": [
                        "step",
                        ["get", "diff"],
                        0.7,
                        -0.15,
                        0.2,
                        -0.05,
                        0,
                        0.05,
                        0.2,
                        0.15,
                        0.7,
                    ]
                },
            },
            firstSymbolId,
        );
    }

    onMount(async () => {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        await import("mapbox-gl/dist/mapbox-gl.css");

        map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/hidegmisi/cm7r3f0tk007j01sd6g6hbjr1",
            center: [
                (hungaryBounds[0][0] + hungaryBounds[1][0]) / 2,
                (hungaryBounds[0][1] + hungaryBounds[1][1]) / 2,
            ],
            zoom: 5,
            minZoom: 4.5,
            maxZoom: 10,
            maxBounds: hungaryBounds,
            bounds: hungaryBounds,
        });

        map.on("load", () => {
            mapLoaded = true;
            map.addControl(new mapboxgl.NavigationControl(), "top-right");

            // When hovering over a feature, update the colorbar arrow
            map.on("mousemove", (event) => {
                const features = map.queryRenderedFeatures(event.point, {
                    layers: [oevkLayerId + oevkLayerIncrement],
                });
                if (features.length > 0 && features[0].properties) {
                    const diff = features[0].properties.diff;
                    updateLegendArrow(diff);
                } else {
                    const arrow = document.getElementById("colorbar-arrow");
                    const label = document.getElementById("colorbar-label");
                    const text = label?.querySelector("text");
                    if (arrow) arrow.style.left = "50%";
                    if (label && text) {
                        label.style.left = "50%";
                        text.innerHTML = "Szoros";
                        text.style.fill = "#333";
                    }
                }
            });
        });
    });
</script>

<article id="mapContainer">
    <!-- Discrete Colorbar Legend -->
    <div id="colorbar-container">
        <div id="colorbar">
            <!-- Five segments, each representing one discrete category -->
            <div
                class="legend-segment"
                style="background: {partyData.fidesz.color}CC;"
                data-label="Fidesz +15%"
            ></div>
            <div
                class="legend-segment"
                style="background: {partyData.fidesz.color}33;"
                data-label="Fidesz +5%"
            ></div>
            <div class="legend-segment" style="background: #0000;" data-label="Szoros"></div>
            <div
                class="legend-segment"
                style="background: {partyData.tisza.color}33;"
                data-label="Tisza +5%"
            ></div>
            <div
                class="legend-segment"
                style="background: {partyData.tisza.color}CC;"
                data-label="Tisza +15%"
            ></div>
        </div>
        <div id="colorbar-arrow"></div>
        <div id="colorbar-label">
            <svg>
                <text x="50%" y="50%">Szoros</text>
            </svg>
        </div>
    </div>
    <div id="map"></div>
</article>

<style lang="scss">
    #mapContainer {
        position: relative;
        margin: 1rem 0;
    }
    #map {
        width: 100%;
        aspect-ratio: 3 / 2;
    }
    /* Container for the colorbar legend */
    #colorbar-container {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        z-index: 2;
        pointer-events: none; /* so the legend doesn't block map interactions */
        background-color: #fff;
        padding: 4px;
        border: 1px solid #ccc;
        pointer-events: all;
    }
    #colorbar {
        display: flex;
        width: 100%;
        height: 16px;
    }
    .legend-segment {
        flex: 1;
    }
    /* Arrow that moves along the colorbar */
    #colorbar-arrow {
        position: absolute;
        top: 20px;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 10px solid #333;
        transform: translateX(-50%);
    }
    /* Label showing the category */
    #colorbar-label {
        position: absolute;
        top: 32px;
        left: 50%;
        width: 80px;
        height: 24px;
        transform: translateX(-50%);
        text-align: center;
        svg {
            width: 100%;
            height: 100%;
            text {
                font-size: 14px;
                fill: #333;
                text-anchor: middle;
                stroke: #fff;
                stroke-width: 3;
                paint-order: stroke;
            }
        }
    }
</style>
