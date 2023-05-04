
import { Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";
import { ReactComponent as LexogrineLogo } from './lexogrine.svg';
import { getTeamName } from "../utils";
import { Logo } from "../Logo";

const FullScreenScoreboard = ({ show, squads }: { show: boolean, squads: Squad[] }) => {
  const [ squad1, squad2, squad3, ...restSquads ] = squads as Squad[];
  const top3: Squad[] = [];
  if(squad1) top3.push(squad1);
  if(squad2) top3.push(squad2);
  if(squad3) top3.push(squad3);
  const allRestSquads =restSquads;
  const firstHalf = [...allRestSquads].splice(0, Math.ceil(allRestSquads.length/2));
  const secondHalf = [...allRestSquads].splice(Math.ceil(allRestSquads.length/2));

  return <div className={`full-screen-scoreboard ${show ? 'show':''}`}>
    <LexogrineLogo width={210} height={30}/>
    <div className="top-3-teams">
      {
        top3.map((squad, i) => <div className="top-3-team">
          <div className={`order-container order-${i+1}`}>
            <div className="order">{i+1}</div>
          </div>
          <div className="team-name"><Logo squad={squad} />{ getTeamName(squad) }</div>
          <div className="team-kills">{squad.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</div>
        </div>)
      }
    </div>
    <div className="rest-squads">
      <div className="squads-column">
        {firstHalf.map((squad, i) => <div className="outside-top-3-squad">{i+4}. {getTeamName(squad)} <span>{squad.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</span></div>)}

      </div>
      <div className="separator" />
      <div className="squads-column">
        {secondHalf.map((squad, i) => <div className="outside-top-3-squad">{firstHalf.length + i+4}. {getTeamName(squad)} <span>{squad.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</span></div>)}

      </div>
    </div>
    {/*squads.map((x, i) => (
      <h3>{i + 1}. {x.name} - {x.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</h3>
    ))*/}
  </div>;
}

export default FullScreenScoreboard;