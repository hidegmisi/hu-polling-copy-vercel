<script lang="ts">
    export let variant = "featured" as "featured" | "big" | "medium" | "small";
    export let hasTopMargin = false;
</script>

<h2 class={variant} class:hasTopMargin>
    <slot />
</h2>

<style lang="scss">
    h2 {
        font-weight: 400;
        font-size: 20px;

        &.hasTopMargin {
            margin-top: 12px;
        }

        &.featured {
            font-size: 26px;
            font-weight: 500;
        }

        &.big {
            font-size: 26px;
        }

        &.medium {
            font-size: 22px;
        }
    }
</style>
