export const ApiUrl= 'ws://localhost:1337'
export const ReducerActions= {
    PLAYER_AVAILABLE: 'ma',
    MATCH_UPDATE: 'mu',
    MATCH_TICK: 'mt',
    PLAYER_READY: 'pr',
    PLAYER_ENTERED: 'pe',
    PLAYER_JOIN: 'pj',
    PLAYER_LEFT: 'pl',
    NEW_PHRASE: 'np',
    MATCH_START: 'ms',
    MATCH_WIN: 'mw',
    MATCH_LOST: 'ml',
    MATCH_CLEANUP: 'mc',
    PHRASE_CORRECT: 'pc',
    TIMER_TICK:'tt',
    INIT_SERVER: 'is',
    CONNECTION_ERROR: 'ce',
    CONNECTED: 'c',
    SET_USER: 'su'
}
declare enum Item {
    SMAL_HEALTH='SMAL_HEALTH',
    LARGE_HEALTH='LARGE_HEALTH'
}

export const Weapon = {
    FIST:{
        name: 'Fist',
        atk: 1,
        range: 1,
        attacks: 1,
        maxAttacks: 1,
        ammo: -1,
        maxAmmo: -1,
        accuracy: 1,
        rune: 'a'
    },
    SP38: {
        name: '.38',
        atk: 1,
        range: 3,
        attacks: 1,
        maxAttacks: 1,
        ammo: 6,
        maxAmmo: 6,
        accuracy: 0.3,
        rune: 'a'
    },
    C1911: {
        name: '1911',
        atk: 2,
        range: 3,
        attacks: 1,
        maxAttacks: 1,
        ammo: 7,
        maxAmmo: 7,
        accuracy: 0.4,
        rune: 'a'
    },
    LUGER: {
        name: 'Luger',
        atk: 3,
        range: 3,
        attacks: 1,
        maxAttacks: 1,
        ammo: 7,
        maxAmmo: 7,
        accuracy: 0.4,
        rune: 'a'
    },
    SPRINGFIELD: {
        name: 'Springfield',
        atk: 3,
        range: 6,
        attacks: 1,
        maxAttacks: 1,
        ammo: 1,
        maxAmmo: 1,
        accuracy: 0.8,
        rune: 'a'
    },
    MAC10: {
        name: 'MAC10',
        atk: 1,
        range: 3,
        attacks: 3,
        maxAttacks: 3,
        ammo: 20,
        maxAmmo: 20,
        accuracy: 0.3,
        rune: 'a'
    },
    MP5: {
        name: 'MP5',
        atk: 2,
        range: 3,
        attacks: 3,
        maxAttacks: 3,
        ammo: 20,
        maxAmmo: 20,
        accuracy: 0.4,
        rune: 'a'
    },
    UZI: {
        name: 'UZI',
        atk: 2,
        range: 2,
        attacks: 4,
        maxAttacks: 4,
        ammo: 24,
        maxAmmo: 24,
        accuracy: 0.3,
        rune: 'a'
    },
    AK: {
        name: 'AK47',
        atk: 3,
        range: 4,
        attacks: 3,
        maxAttacks: 3,
        ammo: 30,
        maxAmmo: 30,
        accuracy: 0.3,
        rune: 'a'
    },
    THOMPSON: {
        name: 'Thompson',
        atk: 3,
        range: 4,
        attacks: 3,
        maxAttacks: 3,
        ammo: 20,
        maxAmmo: 20,
        accuracy: 0.3,
        rune: 'a'
    },
    MG42: {
        name: 'MG42',
        atk: 4,
        range: 5,
        attacks: 5,
        maxAttacks: 5,
        ammo: 50,
        maxAmmo: 50,
        accuracy: 0.2,
        rune: 'a'
    },
    M4: {
        name: 'M4',
        atk: 4,
        range: 5,
        attacks: 3,
        maxAttacks: 3,
        ammo: 30,
        maxAmmo: 30,
        accuracy: 0.4,
        rune: 'a'
    },
    BARRET: {
        name: 'Barret',
        atk: 6,
        range: 7,
        attacks: 1,
        maxAttacks: 1,
        ammo: 5,
        maxAmmo: 5,
        accuracy: 0.8,
        rune: 'a'
    },
    SWEEPER: {
        name: 'Barret',
        atk: 6,
        range: 7,
        attacks: 1,
        maxAttacks: 1,
        ammo: 5,
        maxAmmo: 5,
        accuracy: 0.8,
        rune: 'a'
    },
    MINI: {
        name: 'Mini',
        atk: 3,
        range: 5,
        attacks: 10,
        maxAttacks: 10,
        ammo: 100,
        maxAmmo: 100,
        accuracy: 0.3,
        rune: 'a'
    }
}

export enum MatchStatus {ACTIVE='ACTIVE',WIN='WIN', SETUP='SETUP'}
export enum Directions {LEFT='LEFT', RIGHT='RIGHT', UP='UP', DOWN='DOWN'}
export const FourCoordinates = {
    RIGHT:{x:1,y:0},
    LEFT: {x:-1,y:0},
    DOWN: {x:0,y:1},
    UP: {x:0,y:-1}
}
export const FourCoordinatesArray = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]
export const EightCoordinates = {
    RIGHT:{x:1,y:0},
    UPRIGHT: {x:1, y:-1},
    UP: {x:0,y:-1},
    UPLEFT: {x:-1, y:-1},
    LEFT: {x:-1,y:0},
    DOWNLEFT: {x: -1, y:1},
    DOWN: {x:0,y:1},
    DOWNRIGHT: {x:1, y:1}
}
export const EightCoordinatesArray = [{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1, y:1},{x:0,y:1},{x:1,y:1}]
    
export enum TileType {
    MOUNTAIN='MOUNTAIN',
    FOREST='FOREST',
    RIVER='RIVER',
    HILL='HILL',
    GRASS='GRASS'
}
export const TileSubType = {
    MOUNTAIN: ['a','h','i','j','k','g'],
    HILL: ['l','m','n','o'],
    FOREST: ['b','c','d','e','f'],
    RIVER: ['p','q','r','s','t','u'],
    GRASS: ['']
}
export const EmptyTile = {
    x: 0,
    y: 0,
    type: TileType.GRASS,
    subType: null as null,
    playerId: null as null,
    item: null as null,
    weapon: null as null,
    weaponSpawn: false,
    itemSpawn: false
}