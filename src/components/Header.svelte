<header id="mainHeader">
    <img class="headerImage" src="/images/bg.png" alt="header" />
    <a href="/"><h1>
        <span>Vox Populi:</span>
        <span>Választás 2026</span>
    </h1></a>
</header>

<style lang="scss">
header {
    position: relative;
    display: flex;
    align-items: end;
    justify-content: center;
    margin-bottom: 1rem;
    padding: 8px 16px;
    height: 160px;
    background-color: #fff;
    z-index: 4;

    a {
        text-decoration: none;
    }
}
header img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 0 10%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}
header h1 {
    font-size: 32px;
    background-color: #fff;
    color: #333;
    padding: 0 12px;
}

header h1 span {
    padding: 2px;
    font-weight: 400;

    &:first-child {
        font-weight: 400;
    }
}

@media (max-width: 500px) {
    header {
        padding: 8px;

        h1 {
            font-size: 1rem;
        }
    }
}
</style>