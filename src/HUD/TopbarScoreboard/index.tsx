
import { Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";

const TopbarScoreboard = ({ show, squads, startAt, count }: { show: boolean, squads: Squad[], startAt: number, count: number }) => {
  if (!show) return <div></div>;
  const startIndex = startAt % squads.length;
  return <div className="topbar-scoreboard">
    <span/>
    {squads.map((x, i) => i >= startIndex && i < startIndex + count ? (
      <h3>{i + 1}. {x.name} - {x.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</h3>
    ): null)}
    <span/>
  </div>;
}

export default TopbarScoreboard;