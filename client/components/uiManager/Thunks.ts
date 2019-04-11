import { dispatch } from '../../../client/App'
import { ReducerActions, MatchStatus, Weapon } from '../../../enum'
import WS from '../../WebsocketClient'
export const server = new WS()
import Thunderdome from '../../assets/Thunderdome'
import { toast } from './toast';
import { getRandomInt } from '../Util';

export const onLogin = (currentUser:LocalUser, sessionId:string) => {
    dispatch({ type: ReducerActions.SET_USER, currentUser })
    server.publishMessage({type: ReducerActions.PLAYER_AVAILABLE, currentUser, sessionId})
}

export const onMatchStart = (currentUser:LocalUser, session:Session) => {
    const players = session.players.map((player:Player, i) => {
        return {
            ...player,
            x: getRandomInt(Thunderdome.length),
            y: getRandomInt(Thunderdome[0].length),
            weapon: Weapon.FIST,
            hp: 5,
            maxHp: 5,
            move: 3,
            maxMove: 3,
            armor: 0,
            rune: 'a'
        }
    })
    const newSession = {
        ...session,
        status: MatchStatus.ACTIVE,
        hostPlayerId: currentUser.id,
        players,
        map: Thunderdome.map((row, i) => row.map((tile:Tile, j) => {return {...tile, x:i, y:j, player: players.find(player=>player.x===i && player.y === j)}})),
        ticks: 0,
        turnTickLimit: 20
    }
    sendSessionUpdate(newSession)
}

export const onMovePlayer = (player:Player, session:Session) => {
    session.map.forEach(row => row.forEach(tile => {
        if(tile.player && tile.player.id === player.id) delete tile.player
    }))
    session.map[player.x][player.y].player = player
    sendSessionUpdate(session)
}

export const onAttackTile = (attacker:Player, tile:Tile, session:Session) => {
    const target = tile.player
    target.hp -= attacker.weapon.atk
    attacker.move = 0
    attacker.weapon.attacks--     

    session.map[attacker.x][attacker.y].player = {...attacker}
    if(target.hp <= 0){
        toast.show({message: 'Casualty.'})
        delete session.map[target.x][target.y].player
        session.players = session.players.filter(player=>player.id!==target.id)
    }

    if(session.players.length === 1)
        session.status = MatchStatus.WIN
    
    sendSessionUpdate(session)
}

export const onMatchTick = (session:Session) => {
    session.ticks++
    if(session.ticks >= session.turnTickLimit){
        session.turn++
        onEndTurn(session)
        return
    }
    sendSessionUpdate(session)
}

const onEndTurn = (session:Session) => {
    session.ticks = 0
    session.map.forEach(row=>row.forEach(tile=>{
        if(tile.player) {
            tile.player.move = tile.player.maxMove
            tile.player.weapon.attacks = tile.player.weapon.maxAttacks
            if(tile.player.itemCooldown > 0) tile.player.itemCooldown--
        }
    }))
    sendSessionUpdate(session)
}

export const onUpdatePlayer = (player:Player, session:Session) => {
    session.map.forEach(row=>row.forEach(tile=>{
        if(tile.player && tile.player.id === player.id) tile.player = {...player}
    }))
    sendSessionUpdate(session)
}

export const onMatchWon = (session:Session) => {
    session.status = MatchStatus.WIN
    sendSessionUpdate(session)
}

export const onCleanSession = () => {
    dispatch({
        type: ReducerActions.MATCH_CLEANUP
    })
}

const sendSessionUpdate = (session:Session) => {
    server.publishMessage({
        type: ReducerActions.MATCH_UPDATE,
        sessionId: session.sessionId,
        session: {
            ...session
        }
    })
}