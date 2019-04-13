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
            move: 13,
            maxMove: 13,
            armor: 0,
            rune: 'a'
        }
    })
    const newSession = {
        ...session,
        status: MatchStatus.ACTIVE,
        hostPlayerId: currentUser.id,
        players,
        map: Thunderdome.map((row, i) => 
                row.map((tile:Tile, j) => {
                    let player = players.find(player=>player.x===i && player.y === j)
                    return {...tile, x:i, y:j, playerId: player ? player.id : null}
                })
            ),
        ticks: 0,
        turnTickLimit: 20
    }
    sendSessionUpdate(newSession)
}

export const onMovePlayer = (player:Player, session:Session) => {
    sendReplacePlayer(session, player)
}

export const onAttackTile = (attacker:Player, tile:Tile, session:Session) => {
    const target = session.players.find(player=>player.id === tile.playerId)
    target.hp -= attacker.weapon.atk
    attacker.move = 0
    attacker.weapon.attacks--     

    session = replacePlayer(session, {...attacker})
    
    if(target.hp <= 0){
        toast.show({message: 'Casualty.'})
        delete session.map[target.x][target.y].playerId
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
    session.players.forEach(player=>{
        player.move = player.maxMove
        player.weapon.attacks = player.weapon.maxAttacks
        if(player.itemCooldown > 0) player.itemCooldown--
    })
    sendSessionUpdate(session)
}

export const onUpdatePlayer = (player:Player, session:Session) => {
    sendSessionUpdate(replacePlayer(session, player))
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

const sendReplacePlayer = (session:Session, player:Player) => {
    server.publishMessage({
        type: ReducerActions.PLAYER_REPLACE,
        sessionId: session.sessionId,
        player
    })
}

const replacePlayer = (session:Session, player:Player) => {
    session.players = session.players.filter(splayer=>player.id!==splayer.id)
    session.players.push(player)
    return session
}