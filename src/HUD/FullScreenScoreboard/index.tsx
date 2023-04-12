
import { Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";

const FullScreenScoreboard = ({ show, squads }: { show: boolean, squads: Squad[] }) => {
  if (!show) return <div></div>;

  return <div className="full-screen-scoreboard">
    <h1>Full-Screen Scoreboard</h1>
    {squads.map((x, i) => (
      <h3>{i + 1}. {x.name} - {x.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</h3>
    ))}
  </div>;
}

export default FullScreenScoreboard;