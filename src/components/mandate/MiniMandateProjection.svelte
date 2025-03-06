<script lang="ts">
    import { onMount } from "svelte";
    import type { Simulation } from "$lib/types";
    import { MiniMandateChart } from "$lib/mini-mandate-chart/MiniMandateChart";
    import { DeviceType, getLayoutConfiguration } from "$lib/mini-mandate-chart/MiniMandateChartTypes";

    export let data: Record<string, Simulation> = {};

    let width = 0;
    let height = 0;
    let margin = { top: 20, right: 70, bottom: 20, left: 70 };
    let container: HTMLElement;
    let svg: SVGSVGElement;
    let chart: MiniMandateChart | null = null;
    let simulationData = {} as Simulation;
    let deviceType = DeviceType.Desktop;
    let leaderText = '';
    function updateDimensions() {
        if (!container) return;
        
        const containerWidth = container.clientWidth;
        const windowWidth = window.innerWidth;
        const layoutConfig = getLayoutConfiguration(containerWidth, windowWidth);
        
        // Update dimensions and layout information
        width = containerWidth;
        height = width / layoutConfig.aspectRatio;
        margin = layoutConfig.margin;
        deviceType = layoutConfig.deviceType;
        
        // Update chart with new dimensions if it exists
        if (chart) {
            chart.update({ width, height, margin, deviceType });
        }
    }

    onMount(() => {
        // Load simulation data
        const loadingInterval = setInterval(() => {
            if (data['main']) {
                simulationData = data['main'];
                clearInterval(loadingInterval);
            }
        }, 10);

        // Initial update
        if (container) {
            updateDimensions();
        }
        
        // Set up ResizeObserver for more efficient resize handling
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(entries => {
                if (entries.length > 0) {
                    const { width: newWidth } = entries[0].contentRect;
                    if (newWidth !== width && newWidth > 0) {
                        updateDimensions();
                    }
                }
            });
            
            if (container) {
                resizeObserver.observe(container);
            }
            
            return () => {
                resizeObserver.disconnect();
            };
        } else {
            // Fallback for browsers that don't support ResizeObserver
            let resizeTimeout: ReturnType<typeof setTimeout>;
            const resizeHandler = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    updateDimensions();
                }, 100);
            };
            
            window.addEventListener('resize', resizeHandler);
            
            return () => {
                window.removeEventListener('resize', resizeHandler);
            };
        }
    });
    
    $: if (simulationData['fidesz']?.length && simulationData['tisza']?.length && svg && width > 0) {
        if (!chart) {
            chart = new MiniMandateChart(svg, { width, height, margin, deviceType });
            chart.draw(simulationData);
        } else {
            // The data changed, redraw with current dimensions
            chart.draw(simulationData);
        }
        leaderText = getLeaderText();
    }

    function getLeaderText() {
        if (simulationData.medians.tisza > 133) {
            return 'Tisza kétharmad';
        } else if (simulationData.medians.tisza > 100) {
            return 'Tisza többség';
        } else if (simulationData.medians.fidesz > 133) {
            return 'Fidesz kétharmad';
        } else if (simulationData.medians.fidesz > 100) {
            return 'Fidesz többség';
        }
        return 'Nincs többség';
    }
</script>

<article id="mandate-visualization" bind:this={container}>
    <svg bind:this={svg} viewBox="0 0 {width} {height}"></svg>
    <div class="chartInfos">
        <img src="/images/candidate/fidesz.png" alt="Fidesz" class="fidesz" />
        <div class="textContainer">
            <h2 id="leaderText">Prognózis:</h2>
            <div class="standing">
                {leaderText}
            </div>
        </div>
        <img src="/images/candidate/tisza.png" alt="Tisza" class="tisza" />
    </div>
</article>

<style lang="scss">
.chartInfos {
    position: relative;
    max-width: 250px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -32px;
    padding: 6px;
    border-radius: 120px;
    background-color: #f5f5f5;
    border: 1px solid #eee;
    z-index: 2;

    img {
        width: 36px;
        height: 36px;
        border-radius: 50%;

        &.tisza {
            background-color: #00359c66;
        }
        &.fidesz {
            background-color: #fd810066;
        }
    }

    .textContainer {
        align-items: center;
        padding: 0 8px;
        
        h2#leaderText {
            font-size: 14px;
            font-weight: 600;
            padding: 2px 3px;
            padding-bottom: 0;
        }
        .standing {
            font-size: 12px;
            text-align: center;

            span {
                background: none;
                padding: 0;
            }
        }
    }
}

svg {
    background-color: #f9f9f9;
    border: 2px solid #f5f5f5;
    width: 100%;
    padding-bottom: 30px;
    height: auto;
}

@media (max-width: 600px) {
    .chartInfos {
        max-width: 330px;
        margin-top: -36px;
    }
}
</style>