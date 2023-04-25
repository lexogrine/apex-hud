
import { Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";
import { ReactComponent as LexogrineLogo } from './lexogrine.svg';

const FullScreenScoreboard = ({ show, squads }: { show: boolean, squads: Squad[] }) => {
  if (!show) return <div></div>;
  const [ squad1, squad2, squad3, ...restSquads ] = squads as Squad[];
  const top3: Squad[] = [];
  if(squad1) top3.push(squad1);
  if(squad2) top3.push(squad2);
  if(squad3) top3.push(squad3);
  return <div className="full-screen-scoreboard">
    <LexogrineLogo width={210} height={30}/>
    <div className="top-3-teams">
      {
        top3.map((squad, i) => <div className="top-3-team">
          <div className={`order-container order-${i+1}`}>
            <div className="order">{i+1}</div>
          </div>
          <div className="team-name">{squad.name}</div>
          <div className="team-kills">{squad.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</div>
        </div>)
      }
    </div>
    <div className="rest-squads">
      {restSquads.map((squad, i) => <div className="outside-top-3-squad">{i+4}. {squad.name} <span>{squad.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</span></div>)}
    </div>
    {/*squads.map((x, i) => (
      <h3>{i + 1}. {x.name} - {x.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</h3>
    ))*/}
  </div>;
}

export default FullScreenScoreboard;