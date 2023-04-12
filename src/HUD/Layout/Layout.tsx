import { ApexLegendsState } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import { uuid } from 'uuidv4';
import { Match } from "../../api/interfaces";
import { actions, ApexLegends } from "../../App";
import FullScreenScoreboard from "../FullScreenScoreboard";
import HUDPopup from "../HUDPopup";
import ObservedPlayer from "../ObservedPlayer";
import ObservedTeam from "../ObservedTeam";
import TeamComparison from "../TeamComparison";
import TeamDetails from "../TeamDetails";
import TopbarScoreboard from "../TopbarScoreboard";

interface Props {
  game: ApexLegendsState;
  match: Match | null;
}

interface State {
  showFullScreenScoreboard: boolean;
  showTeamComparison: boolean;
  showTeamDetails: boolean;
  currentlyShownLeaderboardPart: number;
  events: {title: string, content: string, id: string}[]
}

const TOPBAR_LEADERBOARD_TIME_DISPLAYING = 6;

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showFullScreenScoreboard: false,
      showTeamComparison: false,
      showTeamDetails: false,
      currentlyShownLeaderboardPart: 0,
      events: []
    };
  }
  componentDidMount() {
    const changeVisibleLeaderboardSection = () => {
      let newSection = this.state.currentlyShownLeaderboardPart + 3;
        if (newSection >= this.props.game.squads.length) {
          newSection = 0;
        }

        setTimeout(() => {
          this.setState(
            { currentlyShownLeaderboardPart: newSection },
            () => {
              setTimeout(() => {
                changeVisibleLeaderboardSection();
              }, TOPBAR_LEADERBOARD_TIME_DISPLAYING * 1000);
              return;
            }
          );
        }, 1000);
      };
    changeVisibleLeaderboardSection();
    actions.on("toggleFullscreenScoreboard", () => {
      this.setState({ showFullScreenScoreboard: !this.state.showFullScreenScoreboard });
    });
    actions.on("toggleTeamComparison", () => {
      this.setState({ showTeamComparison: !this.state.showTeamComparison });
    });
    actions.on("toggleTeamDetails", () => {
      this.setState({ showTeamDetails: !this.state.showTeamDetails });
    });

    const addEvent = (title: string, content: string) => {
      const id = uuid();
      this.state.events.push({ title, content, id });
      this.setState({ events: this.state.events });
      console.log({event: this.state.events});
      setTimeout(() => {
        this.setState({ events: this.state.events.filter(x => x.id !== id) });
      }, 5000);
    }
    ApexLegends.on("playerKilled", event => {
      addEvent("Player killed!", `${event.attacker.name} killed ${event.victim.name} using ${event.weapon}`);
    });
    ApexLegends.on("squadEliminated", event => {
      addEvent("Squad eliminated!", `${event.players[0].teamName} was defeated!`);
    });
    ApexLegends.on("inventoryPickUp", event => {
      addEvent("Item picked up!", `${event.player.name} picked up ${event.quantity}x ${event.item}!`);
    });
    console.log("apex legends sdasdaf");
  }

  render() {
    const { game, match } = this.props;
    const observedPlayer = game.players.find(x => x.name === game.observedPlayer);
    const observedSquad = game.squads.find(x => x.players.find(p => p.name === game.observedPlayer));
    return (
      <div className="layout">
        <FullScreenScoreboard show={this.state.showFullScreenScoreboard} squads={game.sortedSquads} />
        <TopbarScoreboard show={true} squads={game.sortedSquads} startAt={this.state.currentlyShownLeaderboardPart} count={3} />
        <TeamComparison show={this.state.showTeamComparison && game.sortedSquads.length >= 2} squadLeft={game.sortedSquads[0]} squadRight={game.sortedSquads[1]}/>
        <TeamDetails show={this.state.showTeamDetails && game.sortedSquads.length >= 2} squad={game.sortedSquads[0]}/>
        <ObservedPlayer show={true} player={observedPlayer}/>
        <ObservedTeam show={true} squad={observedSquad}/>
        <HUDPopup show={true} events={this.state.events}/>
      </div>
    );
  }
}
