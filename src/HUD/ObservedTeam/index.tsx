
import { Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";

const ObservedTeam = ({squad, show} : {squad: Squad | undefined, show: boolean}) => {
  if (!show || !squad) return <div></div>;

  return <div className="observed-team"> 
    {squad.players.map(x => <h5>{x.extension ? x.extension.name : x.name}</h5>)}
  </div>;
}

export default ObservedTeam;