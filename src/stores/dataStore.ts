import { writable } from 'svelte/store';
import { getPollData } from '../lib/dataUtils';
import type { PartyData, PollData, PollsterData, PollsterGroup } from '../lib/types';

export const partyData = {
    'fidesz': {
        name: 'Fidesz',
        color: '#fd8100',
    },
    'tisza': {
        name: 'Tisza',
        color: '#00359c',
    },
    'dk_mszp_p': {
        name: 'DK-MSZP-P',
        color: '#007fff',
    },
    'mihazank': {
        name: 'Mi Hazánk',
        color: '#688d1b',
    },
    'mkkp': {
        name: 'MKKP',
        color: '#ff0000',
    },
    'momentum': {
        name: 'Momentum',
        color: '#8e6fcd',
    },
    'semleges': {
        name: 'Semleges',
        color: '#d3d3d3',
    },
    'unsure': {
        name: 'Bizonytalan',
        color: '#a0f7',
    },
} as PartyData;

export const pollsterGroups = [
    "összes",
    "kormányközeli",
    "független",
] as PollsterGroup[];

export const pollsterData = {
    'Nézőpont': {
        name: 'Nézőpont',
        group: 'kormányközeli',
        color: '#eedc82',
    },
    'Századvég': {
        name: 'Századvég',
        group: 'kormányközeli',
        color: '#f4a460',
    },
    'TK': {
        name: 'Társadalomkutató',
        group: 'kormányközeli',
        color: '#eee8aa',
    },
    'Real-PR 93': {
        name: 'Real-PR',
        group: 'kormányközeli',
        color: '#ffa500',
    },
    'IDEA': {
        name: 'IDEA',
        group: 'független',
        color: '#4f94cd',
    },
    'ZRI': {
        name: 'Závecz',
        group: 'független',
        color: '#473c8b',
    },
    'Medián': {
        name: 'Medián',
        group: 'független',
        color: '#aa0099',
    },
    '21 Kutató': {
        name: '21 Kutató',
        group: 'független',
        color: '#663366',
    },
    'Iránytű': {
        name: 'Iránytű',
        group: 'független',
        color: '#116633',
    },
    'Tárki': {
        name: 'Tárki',
        group: 'független',
        color: '#ffcc00',
    },
    'Publicus': {
        name: 'Publicus',
        group: 'független',
        color: '#ee0000',
    },
    'Republikon': {
        name: 'Republikon',
        group: 'független',
        color: '#00cdaa',
    },
} as PollsterData;

export const pollData = writable<Record<'sure_voters' | 'all_voters', PollData>>({
    sure_voters: [],
    all_voters: [],
});

export async function fetchPollData() {
    try {
        const data = await getPollData();
        if (!data) {
            throw new Error('Could not import data.');
        }

        console.log('Data fetched:', data);

        pollData.set(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
