import { Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";
import { getTeamName } from "../utils";
import { Logo } from "../Logo";

const ObservedTeam = (
  { squad, show, observed }: {
    observed?: string;
    squad: Squad | undefined;
    show: boolean;
  },
) => {
  if (!show || !squad) return <div></div>;
  const activePlayer = squad.players.find(player => player.name === observed);
  const players = squad.players.filter(player => player.name !== observed);

  if(activePlayer){
    players.unshift(activePlayer);
  }
  return (
    <>
    <div className="observed-team-details">
      <div className="info">
        <div className="name"><div className="order">1</div><Logo squad={squad} />{getTeamName(squad)}</div>
        <div className="kills">{ squad.players.reduce((p, x) => p + (x.type === 'playing' ? x.kills : 0), 0)}</div>
      </div>
      <div className="team-border"/>
    </div>
    <div className="observed-team">
      <div className="players">
        {players.map((player) => (
          <div
            className={`player ${observed === player.name ? "observed" : ""}`}
          >
            <div className="avatar-container">
              <div className="avatar">
                {player.extension && player.extension.avatar
                  ? <img src={player.extension.avatar} />
                  : null}
              </div>
            </div>
            {player.extension ? player.extension.name : player.name}
          </div>
        ))}
      </div>
      <div className="color-bar"></div>
    </div>
    </>
  );
};

export default ObservedTeam;
