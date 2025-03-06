<script lang="ts">
    import { onMount } from "svelte";

    export let link = null as string | null;

    let absoluteUrl = null as string | null;
    let mounted = false;

    onMount(() => mounted = true);

    $: if (link && mounted) {
        absoluteUrl = new URL(link, document.location.origin).toString();
    }
</script>

<div class="item">
    {#if link}
        <a href={absoluteUrl}>
            <slot />
        </a>
    {:else}
        <slot />
    {/if}
</div>

<style lang="scss">
    .item {
        font-size: 14px;
        padding: 3px 6px;
        border: 1px solid #eee;
        border-radius: 2px;
        cursor: pointer;

        a {
            text-decoration: none;
        }
    }
</style>