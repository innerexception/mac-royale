declare enum Item {
    SMAL_HEALTH='SMAL_HEALTH',
    LARGE_HEALTH='LARGE_HEALTH',
    STIMS='STIMS'
}

declare enum WeaponType {
    FIST='FIST',
    SP38='SP38',
    C1911='C1911',
    LUGER='LUGER',
    SPRINGFIELD='SPRINGFIELD',
    MAC10='MAC10',
    MP5='MP5',
    UZI='UZI',
    AK='AK',
    THOMPSON='THOMPSON',
    MG42='MG42',
    M4='M4',
    BARRET='BARRET',
    SWEEPER='SWEEPER',
    MINI='MINI'
}

declare enum Directions {LEFT='LEFT', RIGHT='RIGHT', UP='UP', DOWN='DOWN'}

declare enum MatchStatus {ACTIVE='ACTIVE',WIN='WIN',LOSE='LOSE', SETUP='SETUP'}

declare enum TileType {
    MOUNTAIN='MOUNTAIN',
    FOREST='FOREST',
    RIVER='RIVER',
    HILL='HILL',
    GRASS='GRASS'
}

interface LocalUser {
    name:string
    id:string
}

interface Weapon {
    name: string
    atk: number
    range: number
    attacks: number
    maxAttacks: number
    ammo: number
    maxAmmo: number
    accuracy: number
    rune: string
}

interface Player {
    name:string
    id:string
    x:number
    y:number
    hp: number
    maxHp: number
    move: number
    maxMove: number
    rune: string
    itemCooldown: number
    item: Item,
    weapon: Weapon,
    armor: number
}

interface Tile {
    x: number
    y: number
    type: TileType
    subType: string
    player: Player | null
    weapon: Weapon | null
    item: Item | null
    weaponSpawn: boolean
    itemSpawn: boolean
}

interface Session {
    sessionId: string,
    hostPlayerId: string,
    status: MatchStatus,
    players: Array<Player>,
    map: Array<Array<Tile>>,
    ticks: number,
    turnTickLimit: number,
    turn: number
}

interface RState {
    isConnected: boolean
    currentUser: LocalUser
    activeSession: Session
}