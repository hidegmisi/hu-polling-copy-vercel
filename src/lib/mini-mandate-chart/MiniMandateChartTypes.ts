import type { Simulation } from "$lib/types";

export enum DeviceType {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop'
}

export const LAYOUT_BREAKPOINTS = {
    MOBILE: 330,
    TABLET: 600
};

export const ASPECT_RATIOS = {
    DESKTOP: 5 / 7, // width/height ratio
    TABLET: 2 / 1,
    MOBILE: 7 / 5
};

export interface ChartMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface MiniMandateChartOptions {
    width: number;
    height: number;
    margin: ChartMargin;
    deviceType: DeviceType;
}

export interface MiniMandateChartData {
    fidesz: { x: number; y: number | null }[];
    tisza: { x: number; y: number | null }[];
    medians: { fidesz: number; tisza: number };
    maxUnified: number;
}

export function getLayoutConfiguration(width: number, windowWidth: number): {
    aspectRatio: number,
    margin: ChartMargin,
    deviceType: DeviceType
} {
    if (width < LAYOUT_BREAKPOINTS.MOBILE && windowWidth < LAYOUT_BREAKPOINTS.TABLET) {
        return {
            aspectRatio: ASPECT_RATIOS.MOBILE,
            margin: { top: 70, right: 40, bottom: 50, left: 40 },
            deviceType: DeviceType.Mobile
        };
    } else if (width > LAYOUT_BREAKPOINTS.MOBILE && windowWidth < LAYOUT_BREAKPOINTS.TABLET) {
        return {
            aspectRatio: ASPECT_RATIOS.TABLET,
            margin: { top: 70, right: 40, bottom: 50, left: 40 },
            deviceType: DeviceType.Tablet
        };
    } else {
        return {
            aspectRatio: ASPECT_RATIOS.DESKTOP,
            margin: { top: 20, right: 70, bottom: 20, left: 70 },
            deviceType: DeviceType.Desktop
        };
    }
}