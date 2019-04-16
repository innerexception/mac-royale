import * as React from 'react'
import { onMovePlayer, onAttackTile, onUpdatePlayer } from '../uiManager/Thunks'
import AppStyles from '../../AppStyles';
import { FourCoordinatesArray, EightCoordinatesArray, TileType, Directions, Item } from '../../../enum'
import { Button, LightButton } from '../Shared'
import { toast } from '../uiManager/toast';

interface Props {
    activeSession: Session
    me: Player
    players: Array<Player>
    map: Array<Array<Tile>>
    isHost: boolean
}

interface State {
    deadPlayers: Array<Player>
    attackingPlayer: boolean
    showDescription: Player | null
    highlightTiles: Array<Array<boolean>>
    visibleTiles: Array<Array<boolean>>
}

export default class Map extends React.Component<Props, State> {

    state = {
        attackingPlayer: false,
        showDescription: null as null,
        highlightTiles: [[false]],
        visibleTiles: getVisibleTilesOfPlayer(this.props.me, this.props.map),
        playerElRef: React.createRef(),
        deadPlayers: []
    }

    componentDidMount = () => {
        window.addEventListener('keydown', (e)=>this.handleKeyDown(e.keyCode))
        this.startMovePlayer()
    }

    componentWillReceiveProps = (props:Props) => {
        let dead = props.activeSession.players.filter(player=>player.hp<=0)
        dead.forEach(player=>{
            if(!this.state.deadPlayers.find(dplayer=>dplayer.id === player.id)){
                toast.show({message: player.name + ' died.'})
            }
        })
        this.setState({deadPlayers: dead})
    }

    startMovePlayer = () => {
        this.setState({attackingPlayer:false, highlightTiles:[[false]]});
        (this.state.playerElRef.current as any).scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center',
                                            inline: 'center',
                                        })
    }
                
    getNotification = () => {
        let activePlayers = this.props.activeSession.players.filter(player=>player.hp>0)
        if(activePlayers.length===1)
            return <div style={{...styles.disabled, display: 'flex'}}>
                        <div style={AppStyles.notification}>
                            {activePlayers[0].name} is Victorious
                        </div>
                    </div>
        else if(this.props.me.hp <= 0){
            return <div style={{...styles.disabled, display: 'flex'}}>
                        <div style={AppStyles.notification}>
                            You died.
                        </div>
                    </div>
        }
        else if(this.state.showDescription)
            return (
                <div style={{...styles.disabled, display: 'flex'}}>
                    <div style={AppStyles.notification}>
                        <div style={{marginBottom:'0.5em'}}>
                            <span style={{fontFamily:'Rune', marginRight:'1em'}}>{(this.state.showDescription as Player).rune}</span>
                            {(this.state.showDescription as Player).name}
                        </div>
                        {Button(true, ()=>this.setState({showDescription:null}), 'Done')}
                    </div>
                </div>
            )
    }

    getMyInfo = () => {
        let player = this.props.me
        return <div style={styles.tileInfo}>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
                        <h4>{player.name}</h4>
                        <h4>HP: {player.hp}</h4>
                        <h4>Arm: {player.armor}</h4>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
                        <h4>Atks: {player.weapon.attacks} / {player.weapon.maxAttacks}</h4>
                        {player.weapon.name !== 'Fist' && <h4>Ammo: {player.weapon.ammo} / {player.weapon.maxAmmo}</h4>}
                        <h4>Moves: {player.move} / {player.maxMove}</h4>
                    </div>
                    {this.getActionButtons(player)}
                </div>
    }
    

    moveUnit = (player:Player, direction:Directions) => {
        let candidateTile = {...this.props.map[player.x][player.y]}
        if(player.move > 0){
            switch(direction){
                case Directions.DOWN: candidateTile.y++
                     break
                case Directions.UP: candidateTile.y--
                     break
                case Directions.LEFT: candidateTile.x--
                     break
                case Directions.RIGHT: candidateTile.x++
                     break
            }
            if(!this.getObstruction(candidateTile.x, candidateTile.y)){
                candidateTile = {...this.props.map[candidateTile.x][candidateTile.y]}
                player.x = candidateTile.x
                player.y = candidateTile.y
                player.move--
                if(candidateTile.item){
                    player.item = candidateTile.item
                } 
                if(candidateTile.weapon){
                    player.weapon = {...candidateTile.weapon}
                } 
                
                candidateTile.playerId = player.id
                this.setState({visibleTiles: getVisibleTilesOfPlayer(player, this.props.map)}, 
                    ()=>onMovePlayer(player, this.props.activeSession));

                (this.state.playerElRef.current as any).scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center',
                    })
            }
        }
    }

    getObstruction = (x:number, y:number) => {
        let tile = this.props.map[x][y]
        if(tile){
            if(tile.playerId) return true
            if(tile.type === TileType.MOUNTAIN || tile.type===TileType.RIVER){
                return true 
            } 
            return false
        }
        return true
    }

    useItem = () => {
        const player = this.props.me
        switch(player.item){
            case Item.SMAL_HEALTH:
                player.hp+=1
                break
            case Item.LARGE_HEALTH:
                player.hp+=3
                break
            case Item.ARMOR_SMALL: 
                player.armor = 1
                break
            case Item.ARMOR_LARGE: 
                player.armor = 3
                break
            case Item.STIMS: 
                player.move = player.maxMove
                break
        }
        onUpdatePlayer(player, this.props.activeSession)
    }

    reload = () => {
        let player = this.props.me
        player.weapon.reloadCooldown = player.weapon.reloadCooldownMax
        onUpdatePlayer(player, this.props.activeSession)
    }

    showAttackTiles = (player:Player) => {
        let highlightTiles = getTilesInRange(player, this.props.map)
        this.setState({attackingPlayer: true, highlightTiles})
    }

    hideAttackTiles = () => {
        this.setState({attackingPlayer: false, highlightTiles:[[false]]})
    }

    performAttackOnTile = (tile:Tile) => {
        //TODO flash/shake tile's unit here with Posed?
        onAttackTile(this.props.me, tile, this.props.activeSession)
        this.hideAttackTiles()
    }

    getActionButtons = (player:Player) => {
        if(player){
            let isOwner = player.id === this.props.me.id
            if(isOwner){
                let buttons = []
                buttons.push(LightButton(player.weapon.ammo > 0 && player.weapon.attacks > 0, ()=>this.showAttackTiles(player), '(A)ttack'))
                if(player.weapon.name !=='Fist') buttons.push(LightButton(player.weapon.reloadCooldown===0, this.reload, player.weapon.reloadCooldown===0 ? '(R)eload' : 'Reloading...'))
                if(player.item) buttons.push(LightButton(!!player.item, this.useItem, '(U)se'))
                return <div>    
                            {buttons}
                       </div>
            }
        }
        return <span/>
    }

    getUnitPortraitOfTile = (tile:Tile) => {
        let tileUnit = this.props.activeSession.players.find(player=>player.id === tile.playerId)
        if(tileUnit){
            return <div style={{textAlign:'right', position:'absolute', top:0, right:0, opacity: getUnitOpacity(tileUnit, this.props.me, this.state.visibleTiles)}} 
                        ref={tileUnit.id === this.props.me.id && this.state.playerElRef as any}>
                        <span style={{fontFamily:'Gun', fontSize:'0.6em'}}>{tileUnit.weapon.rune}</span>
                        <span style={{fontFamily:'Rune', fontSize:'0.7em'}}>{tileUnit.hp > 0 ? tileUnit.rune : 'U'}</span>
                        <div>{new Array(tileUnit.hp).fill(null).map((hp) =>  <span>*</span>)}</div>
                   </div>
        }
        return <span/>
    }

    getMoveArrowsOfTile = (tile:Tile, session:Session) => {
        let tileUnit = session.players.find(player=>player.id === tile.playerId)
        if(tileUnit && tile.playerId === this.props.me.id && this.props.me.hp > 0 && !this.state.attackingPlayer)
            return [
                    <div style={styles.leftArrow} onClick={()=>this.moveUnit(tileUnit, Directions.LEFT)}>{'<'}</div>,
                    <div style={styles.rightArrow} onClick={()=>this.moveUnit(tileUnit, Directions.RIGHT)}>></div>,
                    <div style={styles.upArrow} onClick={()=>this.moveUnit(tileUnit, Directions.UP)}>^</div>,
                    <div style={styles.downArrow} onClick={()=>this.moveUnit(tileUnit, Directions.DOWN)}>v</div>
                ]
        return <span/>
    }

    getTileClickHandler = (tile:Tile) => {
        if(this.state.attackingPlayer) return ()=>this.performAttackOnTile(tile)
        return ()=>this.setState({attackingPlayer:null, highlightTiles:[[false]]})
    }

    handleKeyDown = (keyCode:number) =>{
        if(this.props.me.hp > 0)
            switch(keyCode){
                case 65:
                    this.state.attackingPlayer ? this.hideAttackTiles():this.showAttackTiles(this.props.me)
                    break
                case 38:
                    this.moveUnit(this.props.me, Directions.UP)
                    break
                case 40: 
                    this.moveUnit(this.props.me, Directions.DOWN)
                    break
                case 37: 
                    this.moveUnit(this.props.me, Directions.LEFT)
                    break
                case 39: 
                    this.moveUnit(this.props.me, Directions.RIGHT)
                    break
            }
    }

    render(){
        return (
            <div>
                {this.getMyInfo()}
                <div style={{position:'relative'}}>
                    <div style={styles.mapFrame}>
                        <div style={{display:'flex'}}>
                            {this.props.map.map((row, x) => 
                                <div>
                                    {row.map((tile:Tile, y) => 
                                        <div style={{
                                                ...styles.tile, 
                                                background: this.state.highlightTiles[x] && this.state.highlightTiles[x][y]===true ? AppStyles.colors.grey2 : 'transparent',
                                            }} 
                                            onClick={this.getTileClickHandler(tile)}>
                                            <div style={{fontFamily:'Terrain', color: AppStyles.colors.grey3, fontSize:'2em', opacity: getTerrainOpacity(tile, this.state.visibleTiles)}}>{tile.subType}</div>
                                            {tile.item && <span style={{...styles.tileItem, fontFamily:'Item'}}>{tile.item}</span>}
                                            {tile.weapon && <span style={{...styles.tileItem, fontFamily:'Gun'}}>{tile.weapon.rune}</span>}
                                            {this.getMoveArrowsOfTile(tile, this.props.activeSession)}
                                            {this.getUnitPortraitOfTile(tile)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {this.getNotification()}
                </div>
                <div style={{marginTop:'0.5em'}}>
                    Next turn in {this.props.activeSession.turnTickLimit - this.props.activeSession.ticks} sec
                </div>
            </div>
            
        )
    }
}

const getUnitOpacity = (player:Player, me:Player, visibleTiles: Array<Array<boolean>>) => {
    let isOwner = player.id === me.id
    if(isOwner) 
        return 1
    else 
        return visibleTiles[player.x][player.y] ? 0.5 : 0
}

const getTerrainOpacity = (tile:Tile, visibleTiles: Array<Array<boolean>>) => {
    return visibleTiles[tile.x][tile.y] ? 1 : 0.5
}

const getTilesInRange = (player:Player, map:Array<Array<Tile>>) => {
    let tiles = new Array(map.length).fill(null).map((item) => 
                    new Array(map[0].length).fill(false))
    FourCoordinatesArray.forEach((direction) => {
        let candidateX = player.x
        let candidateY = player.y
        for(var i=player.weapon.range; i>0; i--){
            candidateX += direction.x
            candidateY += direction.y
            if(candidateY >= 0 && candidateX >= 0 
                && candidateX < map.length 
                && candidateY < map[0].length)
                tiles[candidateX][candidateY] = true
        }
    })
    return tiles
}

const getVisibleTilesOfPlayer = (player:Player, map:Array<Array<Tile>>) => {
    let tiles = new Array(map.length).fill(null).map((item) => 
                    new Array(map[0].length).fill(false))
    let playerTile = map[player.x][player.y]
    for(var i=1; i<Math.max(player.weapon.range, getTileSight(playerTile)); i++){
        //TODO: should also be affected by terrain, forest sets sight to 1 but others can't see into, hills provide +1 sight
        let sideLength = 3 + (2*(i-1))
        let corner = {x: player.x-i, y:player.y-i}

        for(var y=0; y<sideLength;y++){
            for(var x=0; x<sideLength; x++){
                let candidate = {x: corner.x+x, y: corner.y+y}
                if(candidate.y >= 0 && candidate.x >= 0 
                    && candidate.x < map.length 
                    && candidate.y < map[0].length){
                        let candidateTile = map[candidate.x][candidate.y]
                        if(sideLength > 3 && candidateTile.type === TileType.FOREST) 
                            tiles[candidate.x][candidate.y] = false
                        else
                            tiles[candidate.x][candidate.y] = true
                    }
            }
        }
        

    }
    return tiles
}

const getTileSight = (tile:Tile) => {
    if(tile.type===TileType.FOREST) return 2
    if(tile.type===TileType.HILL) return 6
    return 4
}

// zzzzzzz
// zyyyyyz
// zyxxxyz   
// zyxbxyz   
// zyxxxyz
// zyyyyyz
// zzzzzzz

const styles = {
    disabled: {
        pointerEvents: 'none' as 'none',
        alignItems:'center', justifyContent:'center', 
        position:'absolute' as 'absolute', top:0, left:0, width:'100%', height:'100%'
    },
    mapFrame: {
        position:'relative' as 'relative',
        backgroundImage: 'url('+require('../../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        overflow:'auto',
        maxHeight:'60vh',
        maxWidth:'100%'
    },
    tileInfo: {
        height: '5em',
        backgroundImage: 'url('+require('../../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        marginBottom: '0.5em',
        padding: '0.5em',
        border: '1px dotted',
        display:'flex',
        justifyContent:'space-between'
    },
    tile: {
        width: '2em',
        height:'2em',
        border: '1px',
        position:'relative' as 'relative'
    },
    tileItem: {
        fontFamily:'Item', color: AppStyles.colors.grey2, fontSize:'0.6em', position:'absolute' as 'absolute', top:0, left:0
    },
    levelBarOuter: {
        height:'0.25em',
        background: AppStyles.colors.white
    },
    leftArrow: {
        position:'absolute' as 'absolute',
        left:'-1em',
        top:0,
        bottom:0,
        width:'1em',
        height:'1em',
        cursor:'pointer',
        zIndex:2
    },
    rightArrow: {
        position:'absolute' as 'absolute',
        right:'-2em',
        top:0,
        bottom:0,
        width:'1em',
        height:'1em',
        cursor:'pointer',
        zIndex:2
    },
    upArrow: {
        position:'absolute' as 'absolute',
        right:0,
        top:'-1em',
        left:'1em',
        width:'1em',
        height:'1em',
        cursor:'pointer',
        zIndex:2
    },
    downArrow: {
        position:'absolute' as 'absolute',
        right:0,
        bottom:'-1em',
        left:'1em',
        width:'1em',
        height:'1em',
        cursor:'pointer',
        zIndex:2
    }
}