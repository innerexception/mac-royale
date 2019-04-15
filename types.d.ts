declare enum Item {
    SMAL_HEALTH='a',
    LARGE_HEALTH='b',
    STIMS='c',
    ARMOR_SMALL='d',
    ARMOR_LARGE='e',
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
    rune: string,
    reloadCooldown: number,
    reloadCooldownMax: number
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
    item: Item
    weapon: Weapon
    armor: number
}

interface Tile {
    x: number
    y: number
    type: TileType
    subType: string
    playerId: string
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