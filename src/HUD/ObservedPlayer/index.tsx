import { Player } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";

const ObservedPlayer = ({player, show} : {player: Player | undefined, show: boolean}) => {
  if (!show || !player) return <div></div>;
  if (player.type === 'waiting') {
    return <div className="observed-player">
      {player.extension ? player.extension.name : player.name}
      </div>;
  }
  
  return <div className="observed-player"> 
    <h3>{player.extension ? player.extension.name : player.name}</h3>
    <h5>Playing as {player.character}</h5>
  </div>;
}

export default ObservedPlayer;