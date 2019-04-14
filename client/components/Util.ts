import { Weapon, Item } from "../../enum";

export const getRandomInt = (max:number) => Math.floor(Math.random() * Math.floor(max))

export const getRandomItem = () => {
    let keys = Object.keys(Item)
    let index = getRandomInt(keys.length-1)
    return Item[keys[index]]
}

export const getRandomWeapon = () =>{
    let keys = Object.keys(Weapon)
    let index = getRandomInt(keys.length-1)
    return Weapon[keys[index]]
}