<div class="sectionTitle">
    <h2>
        <slot />
    </h2>
</div>

<style lang="scss">
    .sectionTitle {
        grid-column: 1 / -1;
        display: flex;
        justify-content: center;
        margin-top: 2rem;
        border-top: 1px solid #eee;
        padding-top: 12px;
        
        h2 {
            font-size: 22px;
            font-weight: 400;
        }
    }
</style>