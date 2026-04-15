#!/usr/bin/env node
const inquirer = require("inquirer");

const URL="https://pokeapi.co/api/v2/";


async function fetchData(url){
    try {
        const res = await fetch(url);
        if(!res.ok){
            console.log(res.statusText);
            return null
        }
        return await res.json();
    }
    catch(err){
        console.log(err)
    }
}
async function getMove(move){
    const data = await fetchData(move.url);

    if (!data) return null;

    return {
        name: data.name,
        power: data.power,
        accuracy: data.accuracy,
        pp: data.pp
    }
}


async function pokemonMoves(pokemon){
    const allmoves = pokemon.moves.slice(0,5).map(m=>m.move)
    const moves = await Promise.all(allmoves.map(getMove));
    return moves.filter(m=>m!==null)
}

function getHP(stats){
    const hp=stats.find(s=>s.stat.name=="hp");
    return hp ? hp.base_stat*10 : 300;
}

async function getPokemon(pokemon){
    const data = await fetchData(`${URL}pokemon/${pokemon}`);
    if (!data) return null;
    const moves = await pokemonMoves(data);
    const hp = getHP(data.stats);
    return{
        pokemon: data.name,
        hp: hp,
        moves
    }
}
function attack(p1, p2, move){
    if(move.pp<=0){
        console.log(`${p1.pokemon} has no pp left for ${move.name}`);
        return;
    }
    const random = Math.random()*100;
    if(random>move.accuracy){
        console.log(`${move.name} missed`);
        move.pp--;
        return
    }
    p2.hp-=move.power;
    move.pp--;
    console.log(`${move.name} landed for ${move.power} dmg`);
}
async function chooseMove(pokemon){
    const answer = await inquirer.prompt([
        {
            type: "list",
            name: "move",
            message: "Select a move",
            choices: pokemon.moves.map((m,i)=>({
                name: `${m.name} (PP ${m.pp})`,
                value: i
            }))
        }
    ])
    return pokemon.moves[answer.move];
}
async function choosePokemon(){
    const choice = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Select a pokemon",
        }
    ]);
    const pokemon = await getPokemon(choice.name.toLowerCase());
    if(!pokemon) {
        console.log("pokemon doesnt exist");
        return choosePokemon();
    }
    console.clear()
    return pokemon;
}
async function enemyPokemon(){
    const random = Math.floor(Math.random()*1025)+1;
    return await getPokemon(random);
}
async function randomMove(pokemon){
    const moves = pokemon.moves.filter(m=>m.pp>0)
    if (moves.length == 0) return null;
    return moves[Math.floor(Math.random()*moves.length)];
}
async function game(){
    const playerpoke= await choosePokemon();
    const enemypoke= await enemyPokemon()
    while(playerpoke.hp>0 && enemypoke.hp>0){
        console.log(`player: ${playerpoke.pokemon} HP: ${playerpoke.hp}`);
        console.log(`enemy: ${enemypoke.pokemon} HP: ${enemypoke.hp}`);

        const playermove= await chooseMove(playerpoke);
        const enemymove= await randomMove(enemypoke);
        console.log(`your move: ${playermove.name}`)
        console.log(`enemymove: ${enemymove.name}`);
        console.clear()


        attack(playerpoke, enemypoke, playermove);

        if(enemypoke.hp<=0) break;

        if(enemymove){
            attack(enemypoke, playerpoke, enemymove);
        }

    }
    if(playerpoke.hp>0){
        console.log("you win")
    }
    else{
        console.log("enemy wins");
    }
}
game();


