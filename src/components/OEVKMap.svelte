<script lang="ts">
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    import { onMount } from "svelte";

    onMount(() => {
        const map = new maplibregl.Map({
            container: "map",
            style: "https://cors-anywhere.herokuapp.com/https://tile.tracestrack.com/v/maps/lite/style-hu.json?key=4310cac1701b2fc10569b55017f60a5f",
            center: [19.5033, 47.1625], // Hungary's center
            zoom: 7,
        });

        map.addControl(new maplibregl.NavigationControl());
    });
</script>

<div id="map"></div>

<style>
    #map {
        width: 100%;
        aspect-ratio: 3 / 2;
    }
</style>
