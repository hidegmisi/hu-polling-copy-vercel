<script lang="ts">
    export let id = null as string | null;
    export let columns = null as string | null;
</script>

<section {id}>
    <slot />
</section>

<style lang="scss">
    section {
        display: grid;
        grid-template-columns: 1fr;
        gap: 6px;
        padding: 2rem 1rem;
        padding-top: 8px;
        background-color: #fcfcfc;
        border: 1px solid #eee;
    }
</style>
