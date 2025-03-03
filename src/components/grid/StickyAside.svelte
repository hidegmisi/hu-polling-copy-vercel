<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let aside: HTMLElement;

    function keepAsidePosition() {
        const headerHeight = 160 + 55;
        if (!aside) return;

        if (window.scrollY > headerHeight + 16 && window.innerWidth > 600) {
            aside.style.position = "fixed";
            aside.style.top = "16px";
            aside.style.width = "250px";
        } else {
            aside.style.position = "static";
            aside.style.width = "auto";
        }
    }

    onMount(() => {
        keepAsidePosition();
        window.addEventListener("scroll", keepAsidePosition);
        window.addEventListener("resize", keepAsidePosition);

        return () => {
        window.removeEventListener("scroll", keepAsidePosition);
        window.removeEventListener("resize", keepAsidePosition);
        };
    });
</script>

<aside bind:this={aside} class="grid-item aside">
    <slot />
</aside>

<style lang="scss">
    .grid-item.aside {
        grid-column: 1 / -1;
    }

    @media (min-width: 600px) {
        .grid-item.aside {
            grid-column: 1 / 2;
        }
    }
</style>
