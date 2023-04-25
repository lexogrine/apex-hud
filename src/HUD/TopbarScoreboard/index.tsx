
import { Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";

const TopbarScoreboard = ({ show, squads, startAt, count }: { show: boolean, squads: Squad[], startAt: number, count: number }) => {
  if (!show) return <div></div>;
  const startIndex = startAt % squads.length;
  console.log(squads)
  return <div className="topbar-scoreboard">
    {squads.filter(x => x.name !== "Spectator").map((x, i) => i >= startIndex && i < startIndex + count ? (
      <div className={`topbar-team order-${i+1}`}>
        <div className="order">{i+1}</div>{x.teamExtension && x.teamExtension.name || x.name} {/*x.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)*/}
        <div className="border-bottom" />
      </div>
    ): null)}
    <span/>
  </div>;
}

export default TopbarScoreboard;