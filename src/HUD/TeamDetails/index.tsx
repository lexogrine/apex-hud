import {
  AbilityLog,
  ItemLog,
  PlayerPlaying,
  PlayerWaiting,
  Squad,
} from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";
import { PlayerExtension } from "apexlegendsgsi/types/interfaces";

const TeamDetails = ({ squad, show }: { squad: Squad; show: boolean }) => {
  if (!show) return <div></div>;
  return (
    <div className="team-details">
      <h3>{squad.teamExtension ? squad.teamExtension.name : squad.name}</h3>
      <div className="players">
      {(squad.players.filter((player) =>
        player.type === "playing"
      ) as ({ name: string; extension?: PlayerExtension } & (PlayerPlaying))[])
        .map((x) => (
          <div className="player-tab">
            <div className="top" >
              {x.extension && x.extension.avatar ? <img src={x.extension.avatar} /> : null}
            </div>
            <div className="content">
              <div className="playername">
                {x.extension ? x.extension.name : x.name}
              </div>
              <div className="hero">{x.character}</div>
              <div className="details">
                <div className="entry">
                  Damage dealt{" "}
                  <span className="value">
                    {x.damageLog.map((x) => x.damage).reduce((pr, dam) =>
                      dam + pr, 0)}
                  </span>
                </div>
                <div className="entry">
                  Kills <span className="value">{x.kills}</span>
                </div>
                <div className="entry">
                  Knockdowns <span className="value">{x.knockdowns}</span>
                </div>
                <div className="entry">
                  Skills Used{" "}
                  <span className="value">{x.abilitiesUsedLog.length}</span>
                </div>
                <div className="entry">
                  DISTANCE TRAVELED{" "}
                  <span className="value">{Math.round(x.distanceRun)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}</div>
    </div>
  );
};

export default TeamDetails;
