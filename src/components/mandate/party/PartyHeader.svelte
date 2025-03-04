<script lang="ts">
    import type { Party } from "$lib/types";
    import { partyData } from "$stores/dataStore";

    export let party: Party;
</script>

<header>
    <img
        src={`/images/party-logo/${party}.png`}
        alt={party}
    />
    <h3>{partyData[party].name}</h3>
</header>

<style lang="scss">
    header {
        display: grid;
        grid-template-columns: 24px 1fr;
        align-items: center;
        gap: 6px;
        padding: 0 6px;

        img {
            width: 24px;
            height: 24px;
            object-fit: contain;
        }

        h3 {
            font-size: 20px;
            font-weight: 400;
        }
    }
</style>