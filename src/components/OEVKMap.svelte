<script lang="ts">
    import { onMount } from "svelte";
    import mapboxgl, { type LngLatBoundsLike } from "mapbox-gl";
    import { partyData } from "../stores/dataStore";
    import type { Simulation } from "$lib/types";
    import { sum } from "d3";

    export let data = {} as Simulation["oevkDiffs"];

    let map: mapboxgl.Map;
    let mapLoaded = false;
    let geojsonData: GeoJSON.FeatureCollection;
    let oevkLayerId = "map-a6brax";
    let oevkLayerIncrement = 0;

    // Replace with your Mapbox token
    const MAPBOX_ACCESS_TOKEN =
        "pk.eyJ1IjoiaGlkZWdtaXNpIiwiYSI6ImNrNmx5YzlwODBpbjEzbnA3d216cTRjcXAifQ.0Fvgxohx9xZmb-14mcC71g";

    // Define bounds (Hungary)
    const hungaryBounds = [
        [16.113 - 1, 45.737 - 0.2], // Southwest
        [22.896 + 1, 48.585 + 0.2], // Northeast
    ] as LngLatBoundsLike;

    $: if (map && data) {
        const loadingInterval = setInterval(() => {
            if (mapLoaded) {
                clearInterval(loadingInterval);
                loadGeoJSON();
            }
        }, 1000);
    }

    // Load the GeoJSON file
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

            map.addLayer({
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
            }, firstSymbolId);
        }

        // Add color property to each feature
        for (let feature of geojsonData.features) {
            if(!feature.properties) continue;
            feature.properties.diff = data[feature.properties?.OEVK] ?? 0;
        }

        // Add GeoJSON source & layer
        if (map.getLayer(oevkLayerId + oevkLayerIncrement)) {
            map.removeLayer(oevkLayerId + oevkLayerIncrement);
        }
                
        oevkLayerIncrement++;
        
        map.addLayer({
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
                    ["get","diff"],
                    -0.3, partyData["fidesz"].color,
                    0, "rgba(0,0,0,0)",
                    0.3, partyData["tisza"].color,
                ],
                "fill-opacity": 0.55,
            },
        }, firstSymbolId);
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
            zoom: 4.5,
            minZoom: 4.5,
            maxZoom: 10,
            maxBounds: hungaryBounds,
            bounds: hungaryBounds,
        });

        map.on("load", () => {
            mapLoaded = true;

            map.addControl(new mapboxgl.NavigationControl(), "top-right");
            
            const tooltip = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });
    
            map.on("mousemove", oevkLayerId + oevkLayerIncrement, (e) => {
                console.log(e);
                
                const feature = e.features.diff;
                if (feature) {
                    tooltip
                        .setLngLat(e.lngLat)
                        .setHTML(
                            `<h3>${feature.properties?.OEVK}. számú választókerület</h3>
                            <p>${partyData["fidesz"].name}: ${feature.properties?.fidesz}</p>
                            <p>${partyData["tisza"].name}: ${feature.properties?.tisza}</p>`
                        )
                        .addTo(map);
                }
            });
        })

    });
</script>

<div id="map"></div>

<style>
    #map {
        width: 100%;
        aspect-ratio: 3 / 2;
    }
</style>
