import * as d3 from "d3";
import type { PollData, Simulation } from "./types";

/* const aggregatorNameMap: { [key in keyof Omit<CandidateData, 'candidate' | 'date' | 'avg'>]: {abv: string, full: string, link: string} } = {
    fivethirtyeight: {abv: "538", full: "538 (ABC News)", link: "https://projects.fivethirtyeight.com/polls/president-general/2024/national/"},
    natesilver: {abv: "Nate Silver", full: "Silver Bulletin", link: "https://www.natesilver.net/p/we-removed-rfk-jr-from-our-model"},
    nyt: {abv: "NYT", full: "New York Times", link: "https://www.nytimes.com/interactive/2024/us/elections/polls-president.html"},
    realclearpolling: {abv: "RCP", full: "RealClear Politics", link: "https://www.realclearpolling.com/polls/president/general/2024/trump-vs-harris"},
    economist: {abv: "Economist", full: "The Economist", link: "https://www.economist.com/interactive/us-2024-election/trump-harris-polls"},
}; */

async function fetchPollData(): Promise<Record<string, PollData>> {
    const basePath = 'data/';
    let fetchedData: Record<string, PollData> = {};
    for (const tableName of ["sure_voters", "all_voters"]) {
        const response = await fetch(basePath + tableName + ".csv");
        const csvText = await response.text();
        fetchedData[tableName] = d3.csvParse(csvText) as unknown as PollData;
    }
    return fetchedData;
}


async function fetchSimulationData(): Promise<Record<string, Simulation> | false> {
    const response = await fetch("data/simulationData.json");
    if (!response.ok) return false;
    return await response.json();
}

function isDataStale() {
    const oneHour = 1000 * 60 * 60;
    const now = new Date();
    const lastUpdated = new Date(sessionStorage.getItem("dataUpdated") || 0);
    const diff = now.getTime() - lastUpdated.getTime();

    return (
        sessionStorage.getItem("dataUpdated") == null ||
        sessionStorage.getItem("pollsData") == null ||
        sessionStorage.getItem("simulationData") == null ||
        diff >= oneHour
    );
}

async function getData() {
    let retrivedData = null;

    if (isDataStale()) {
        const pollData = await fetchPollData();
        if (!pollData) return false;

        const simulationData = await fetchSimulationData();
        if (!simulationData) return false;

        const now = new Date();
        sessionStorage.setItem("dataUpdated", now.toString());
        sessionStorage.setItem("pollsData", JSON.stringify(pollData));
        sessionStorage.setItem("simulationData", JSON.stringify(simulationData));
        retrivedData = { pollData, simulationData };
    } else {
        const storedData = {
            pollData: sessionStorage.getItem("pollsData"),
            simulationData: sessionStorage.getItem("simulationData"),
        }
        if (storedData.pollData === null || storedData.simulationData === null) return false;
        
        retrivedData = {
            pollData: JSON.parse(storedData.pollData) as Record<string, PollData>,
            simulationData: JSON.parse(storedData.simulationData) as Record<string, Simulation>,
        };
    }

    retrivedData.pollData.sure_voters.forEach((d) => {
        d.date = new Date(d.date);
    });
    retrivedData.pollData.all_voters.forEach((d) => {
        d.date = new Date(d.date);
    });

    return retrivedData;
}

export { getData };
