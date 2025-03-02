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

    // Updates the position of the arrow on the colorbar based on the diff value.
    function updateLegendArrow(diff: any) {
        const diffValue = parseFloat(diff);
        // Map the diff value from the range [-0.3, 0.3] to [0, 100]%
        const percentage = Math.max(
            Math.min(diffValue, 0.3),
            -0.3
        ) * 100 / 0.6 + 50;
        const arrow = document.getElementById("colorbar-arrow");
        const label = document.getElementById("colorbar-label");
        const text = label?.querySelector("text");

        if (!arrow || !label || !text) return;
        
        arrow.style.left = percentage + "%";
        arrow.style.display = "block";

        label.style.display = "block";
        text.innerHTML = "+" + Math.abs((diffValue * 100)).toFixed(0) + '%';
        text.style.fill = diffValue > 0 ? partyData["tisza"].color : partyData["fidesz"].color;

        label.style.left = percentage + "%";
        
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

        // Remove previous OEVK layer if it exists
        if (map.getLayer(oevkLayerId + oevkLayerIncrement)) {
            map.removeLayer(oevkLayerId + oevkLayerIncrement);
        }
        oevkLayerIncrement++;

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
                        "interpolate",
                        ["linear"],
                        ["get", "diff"],
                        -0.3,
                        partyData["fidesz"].color,
                        0,
                        "rgba(0,0,0,0)",
                        0.3,
                        partyData["tisza"].color,
                    ],
                    "fill-opacity": 0.55,
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
                        text.innerHTML = "0%";
                        text.style.fill = "#333";
                    }

                }
            });
        });
    });
</script>

<article id="mapContainer">
    <!-- Colorbar Legend -->
    <div id="colorbar-container">
        <!-- The gradient uses the colors from partyData -->
        <div
            id="colorbar"
            style="background: linear-gradient(to right, {partyData['fidesz']
                .color}, rgba(0,0,0,0), {partyData['tisza'].color});"
        ></div>
        <div id="colorbar-arrow"></div>
        <div id="colorbar-label">
            <svg>
                <text x="50%" y="50%">
                    
                </text>
            </svg>
        </div>
    </div>
    <div id="map"></div>
</article>

<style lang="scss">
    #mapContainer {
        position: relative;
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
        height: 40px;
        z-index: 2;
        pointer-events: none; /* so the legend doesn't block map interactions */
        background-color: #fff;
        height: fit-content;
    }
    #colorbar {
        width: 100%;
        height: 16px;
        border: 1px solid #ccc;
        position: relative;
    }
    /* Arrow that will move along the colorbar */
    #colorbar-arrow {
        position: absolute;
        top: 16px;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 10px solid #333;
        transform: translateX(-50%);
    }
    /* Label showing the diff value */
    #colorbar-label {
        position: absolute;
        top: 26px;
        left: 50%;
        width: 60px;
        height: 36px;
        translate: -50%;
        //display: none;

        svg {
            width: 100%;
            height: 100%;

            text {
                font-size: 16px;
                fill: #333;
                text-anchor: middle;
                stroke: #fff;
                stroke-width: 3;
                paint-order: stroke;
            }
        }
    }
</style>
