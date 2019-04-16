import * as React from 'react'
import { onMatchStart, onUpdatePlayer } from './uiManager/Thunks'
import AppStyles from '../AppStyles'
import { TopBar } from './Shared'
import { PlayerRune } from '../../enum'

interface Props { 
    activeSession:Session
    currentUser:LocalUser
}

export default class Lobby extends React.Component<Props> {

    state = { selectedAvatarIndex: 0 }

    startMatch = () => {
        console.log(this.props)
        onMatchStart(
            this.props.currentUser, 
            this.props.activeSession)
    }

    chooseAvatar = (avatar:string) => {
        let player = this.props.activeSession.players.find(player=>player.id === this.props.currentUser.id)
        player.rune = avatar
        onUpdatePlayer(player, this.props.activeSession)
    }

    getErrors = () => {
        if(this.props.activeSession.players.length < 2) return 'Waiting for more to join...'
    }

    selectAvatar = (inc:number) => {
        let selectedIndex = Math.min(Math.max(0,this.state.selectedAvatarIndex+inc), PlayerRune.length-1)
        this.setState({selectedAvatarIndex: selectedIndex})
        this.chooseAvatar(PlayerRune[selectedIndex])
    }

    render(){
        return (
            <div style={AppStyles.window}>
                {TopBar('MacRoyale')}
                <div style={{padding:'0.5em'}}>
                    <h3>{this.props.activeSession.sessionId} Lobby</h3>
                    <div style={{marginBottom:'1em', alignItems:'center', overflow:'auto', maxHeight:'66vh'}}>
                        {this.props.activeSession.players.map((player:Player) => 
                            <div style={styles.nameTag}>
                                {player.name}
                                <div style={{display:'flex'}}>
                                    <div style={{cursor:'pointer'}} onClick={()=>this.selectAvatar(-1)}>{'<'}</div>
                                    <div style={{fontFamily:'Rune'}}>{player.rune}</div>
                                    <div style={{cursor:'pointer'}} onClick={()=>this.selectAvatar(1)}>></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>{this.getErrors()}</div>
                    {this.getErrors() ? '' : 
                        <div style={AppStyles.buttonOuter} 
                            onClick={this.startMatch}>
                            <div style={{border:'1px solid', borderRadius: '3px', opacity: this.getErrors() ? 0.5 : 1}}>Start</div>
                        </div>}
                </div>
            </div>
            
        )
    }
}

const styles = {
    nameTag: {
        background: 'white',
        border: '1px solid',
        width: '100%',
        padding: '0.25em',
        marginBottom: '5px',
        minWidth:'10em',
        display:'flex',
        justifyContent: 'space-between'
    }
}