<script lang="ts">
    import { onMount } from "svelte";
    import type { Map } from "leaflet";
    import { partyData } from "../stores/dataStore";
    
    let map: Map;
    let geojsonData;
    let L: typeof import("leaflet");

    // Load the GeoJSON file
    async function loadGeoJSON() {
        const response = await fetch("/geo/oevks.geojson");
        geojsonData = await response.json();
        
        for (let feature of geojsonData.features) {
            feature.properties = {
                ...feature.properties,
                color: Math.random() > 0.5 ? partyData["tisza"].color : partyData["fidesz"].color,
            };
        }
        
        if (map && L) {
            L.geoJSON(geojsonData, {
                style: feature => ({
                    color: feature?.properties.color,
                    weight: 1,
                    fillOpacity: 0.3,
                }),
            }).addTo(map);
        }
    }

    onMount(async () => {
        L = await import("leaflet");
        import("leaflet/dist/leaflet.css");

        if (!L) return;

        map = L.map("map").setView([47.1625, 19.5033], 7); // Centered on Hungary

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        loadGeoJSON();
    });
</script>

<div id="map"></div>

<style>
    #map {
        width: 100%;
        aspect-ratio: 3 / 2;
    }
</style>
