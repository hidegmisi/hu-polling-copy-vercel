<script lang="ts">
    import { onMount } from "svelte";
    import mapboxgl, { type LngLatBoundsLike } from "mapbox-gl";
    import { partyData } from "$stores/dataStore";
    import type { Simulation } from "$lib/types";

    export let data = {} as Simulation["oevkDiffs"];

    let map: mapboxgl.Map;
    let mapLoaded = false;
    let geojsonData: GeoJSON.FeatureCollection;
    let oevkLayerId = "oevks";
    let oevkLayerIncrement = 0;

    const MAPBOX_ACCESS_TOKEN =
        "pk.eyJ1IjoiaGlkZWdtaXNpIiwiYSI6ImNrNmx5YzlwODBpbjEzbnA3d216cTRjcXAifQ.0Fvgxohx9xZmb-14mcC71g";
    const hungaryBounds: [[number, number], [number, number]] = [
        [15.113, 45.737 - 0.1],
        [23.896, 48.585 + 0.3],
    ];

    const colors = [
        partyData["fidesz"].color,
        "#ffb985",
        "#f1f1f1",
        "#908dc7",
        partyData["tisza"].color,
    ];

    // Updates the arrow on the legend based on diff value,
    // snapping to the center of the corresponding discrete category.
    function updateLegendArrow(diff: any) {
        const diffValue = parseFloat(diff);
        let position: number;
        let category: string;

        if (diffValue < -0.15) {
            position = 10;
            category = "Fidesz +15%";
        } else if (diffValue < -0.05) {
            position = 30;
            category = "Fidesz +5%";
        } else if (diffValue < 0.05) {
            position = 50;
            category = "Szoros";
        } else if (diffValue < 0.15) {
            position = 70;
            category = "Tisza +5%";
        } else {
            position = 90;
            category = "Tisza +15%";
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
            text.style.fill = "#333";
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
        }

        // Add the diff property to each feature
        for (let feature of geojsonData.features) {
            if (!feature.properties) continue;
            feature.properties.diff = data[feature.properties?.OEVK] ?? 0;
        }

        // Add the OEVK lines layer
        map.addLayer(
            {
                id: "oevk-lines",
                type: "line",
                source: {
                    type: "geojson",
                    data: geojsonData,
                },
                paint: {
                    "line-width": 0.5,
                    "line-opacity": 0.2,
                },
            },
            firstSymbolId,
        );

        // Set the line color based on the diff value
        map.setPaintProperty("oevk-lines", "line-color", [
            "case",
            [">=", ["get", "diff"], 0.05],
            partyData["tisza"].color,
            ["<=", ["get", "diff"], -0.05],
            partyData["fidesz"].color,
            "#000",
        ]);
        

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
                        colors[0],
                        -0.15,
                        colors[1],
                        -0.05,
                        colors[2],
                        0.05,
                        colors[3],
                        0.15,
                        colors[4],
                    ],
                    /* "fill-opacity": [
                        "step",
                        ["get", "diff"],
                        0.3,
                        -0.15,
                        0.1,
                        -0.05,
                        0,
                        0.05,
                        0.1,
                        0.15,
                        0.3,
                    ] */
                    "fill-opacity": 0.6,
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
            style: "mapbox://styles/hidegmisi/cm7tlvdsq00bz01sc7hred6j6",
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
                        text.innerHTML = "Ki esélyes?";
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
                style="background: {colors[0]}; opacity: 0.6;"
                data-label="Fidesz +15%"
            ></div>
            <div
                class="legend-segment"
                style="background: {colors[1]}; opacity: 0.6;"
                data-label="Fidesz +5%"
            ></div>
            <div
                class="legend-segment"
                style="background: {colors[2]}; opacity: 0.6"
                data-label="Ki esélyes?"
            ></div>
            <div
                class="legend-segment"
                style="background: {colors[3]}; opacity: 0.6;"
                data-label="Tisza +5%"
            ></div>
            <div
                class="legend-segment"
                style="background: {colors[4]}; opacity: 0.6;"
                data-label="Tisza +15%"
            ></div>
        </div>
        <div id="colorbar-arrow"></div>
        <div id="colorbar-label">
            <svg>
                <text x="50%" y="50%">Ki esélyes?</text>
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
        /* border: 1px solid #eee; */
        outline: 2px solid #fff;
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
        overflow: visible;

        svg {
            width: 100%;
            height: 100%;
            overflow: visible;

            text {
                font-size: 14px;
                fill: #333;
                text-anchor: middle;
                stroke: #fff;
                stroke-width: 4;
                paint-order: stroke;
            }
        }
    }
</style>
