import { Squad } from "apexlegendsgsi";
import React from "react";
import { apiUrl } from "../api/api";

export const Logo = ({ squad}: { squad?: Squad | null }) => {
    return squad && squad.teamExtension && squad.teamExtension.logo ? <img className="logo" src={`${apiUrl}api/teams/logo/${squad.teamExtension.id}`} /> : null
}