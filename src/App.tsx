
import { ApexLegendsGSI } from 'apexlegendsgsi';
import { ApexLegendsState } from 'apexlegendsgsi/types/apexlegends';
import { PlayerExtension } from 'apexlegendsgsi/types/interfaces';
import React from 'react';
import { io } from "socket.io-client";
import ActionManager, { ConfigManager } from './api/actionManager';
import api, { port } from './api/api';
import { Match } from './api/interfaces';
import Layout from './HUD/Layout/Layout';

export const ApexLegends = new ApexLegendsGSI();
export const socket = io(true ? `localhost:${port}` : '/');

console.log('dev i guess')
socket.on('update', (data: any) => {
	//console.log("update...");
	ApexLegends.digest(data);
});

export const actions = new ActionManager();
export const configs = new ConfigManager();

export const hudIdentity = {
	name: '',
	isDev: false
};

interface DataLoader {
	match: Promise<void> | null
}

const dataLoader: DataLoader = {
	match: null
}

class App extends React.Component<any, { game: ApexLegendsState | null, match: Match | null, checked: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = {
			game: null,
			match: null,
			checked: false,
		}
	}

	verifyPlayers = async (game: ApexLegendsState) => {
		const extensioned = await api.players.get();
		const teamsExtensions = await api.teams.get();

		const players: PlayerExtension[] = extensioned
			.map(player => (
				{
					id: player._id,
					name: player.username,
					realName: `${player.firstName} ${player.lastName}`,
					steamid: player.steamid,
					country: player.country,
					avatar: player.avatar,
					teamId: player.team,
					extra: player.extra,
				})
			);
		
		ApexLegends.teams.push(...teamsExtensions.map(team => ({
			id: team._id,
			name: team.name,
			country: team.country,
			logo: team.logo,
			map_score: 0,
			extra: {}
		})));

		console.log(ApexLegends.teams);

		ApexLegends.players = players;

	//	console.log(ApexLegends.players)
	}


	componentDidMount() {
		this.loadMatch();
		const href = window.location.href;
		const events = [];
		socket.emit("started");
		let isDev = false;
		let name = '';
		if (href.indexOf('/huds/') === -1) {
			isDev = true;
			name = (Math.random() * 1000 + 1).toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
			hudIdentity.isDev = true;
		} else {
			const segment = href.substr(href.indexOf('/huds/') + 6);
			name = segment.substr(0, segment.lastIndexOf('/'));
			hudIdentity.name = name;
		}

		socket.on("readyToRegister", () => {
			socket.emit("register", name, isDev, 'apexlegends');
		});
		socket.on(`hud_config`, (data: any) => {
			configs.save(data);
		});
		socket.on(`hud_action`, (data: any) => {
			actions.execute(data.action, data.data);
		});
		socket.on('keybindAction', (action: string) => {
			actions.execute(action);
		});
	
		socket.on("refreshHUD", () => {
			const windowTop = window.top;
			if (windowTop) {
				 windowTop.location.reload();
			}
		});

		ApexLegends.on('data', (data: any) => {
			if (!this.state.game) this.verifyPlayers(data);
			this.setState({ game: data });
		});

		socket.on('match', () => {
			this.loadMatch(true);
		});
	}

	loadMatch = async (force = false) => {
		if (!dataLoader.match || force) {
			dataLoader.match = new Promise((resolve) => {
				api.match.getCurrent().then(match => {
					if (!match) {
						dataLoader.match = null;
						return;
					}
					this.setState({ match });
				}).catch(() => {
					dataLoader.match = null;
				});
			});
		}
	}
	render() {
		if (!this.state.game) {
			return null;
		}
		return (
			<Layout game={this.state.game} match={this.state.match}/>
		);
	}

}
export default App;
