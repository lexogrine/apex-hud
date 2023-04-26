import { Squad } from "apexlegendsgsi";

export const getTeamName = (squad: Squad) => squad.teamExtension ? (squad.teamExtension.name || squad.name) : squad.name;