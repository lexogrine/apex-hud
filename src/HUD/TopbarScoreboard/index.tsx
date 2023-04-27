
import { Squad } from "apexlegendsgsi/types/apexlegends";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { getTeamName } from "../utils";
import { Logo } from "../Logo";
import { configs } from "../../App";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];


const TopbarScoreboard = ({ show, squads, startAt, count }: { show: boolean, squads: Squad[], startAt: number, count: number }) => {
  const [ tname, setName ] = useState('');
  useEffect(() => {
    const onData = (data: any) => {
      if(!data || !data.general) return;
      setName(data.general.tournament_name || '');
    }
    configs.onChange(onData);
    onData(configs.data);

    return () => {
      configs.listeners = configs.listeners.filter(cfg => cfg !== onData);
    }
  }, []);
  const startIndex = startAt % squads.length;
  return <div className="topbar-scoreboard" style={{ opacity: show ? 1 : 0 }}>
    
      {tname ? <div className={`topbar-team tournament-info`}><strong>{tname}</strong></div> : null }
    
    {squads.filter(x => x.name !== "Spectator").map((x, i) => i >= startIndex && i < startIndex + count ? (
      <div className={`topbar-team order-${i+1}`}>
        <div className="order">{i+1}</div><Logo squad={x} /> {getTeamName(x)} {/*x.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)*/}
        <div className="border-bottom" />
      </div>
    ): null)}
    <span/>
  </div>;
}

export default TopbarScoreboard;