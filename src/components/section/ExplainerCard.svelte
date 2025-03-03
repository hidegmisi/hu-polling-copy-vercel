<script lang="ts">
    export let image = null as string | null;
    export let alt = "Példa";
</script>

<div class="explainer">
    {#if image}
        <div class="example">
            <img src="{image}" alt="{alt}" />
        </div>
    {/if}
    <p><slot /></p>
</div>

<style lang="scss">
    .explainer {
        display: flex;
        margin: var(--margin, 12px 0);
        border: 1px solid #eee;
        background-color: #f9f9f9;
        padding: 12px 6px;

        .example {
            flex-shrink: 0;
            margin-right: 12px;
            display: flex;
            width: 60px;

            img {
                width: 100%;
                object-fit: contain;
                filter: grayscale(1);
            }
        }

        p {
            margin: 0;
        }
    }
</style>
