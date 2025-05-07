import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../Utils"

export default function SideNav(props) {
    const { pokemonselected, setpokemonselected, handleCloseMenu, showSideMenu } = props
    const [searchvalue, setsearchvalue] = useState('')

    const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
        // if full pokedex number includes the current search value, return true
        if ((getFullPokedexNumber(eleIndex)).includes(searchvalue)) { return true }

        // if the pokemon name includes the current search value, return true
        if (ele.toLowerCase().includes(searchvalue.toLowerCase())) { return true }

        // otherwise, exclude value from the array
        return false
    })

    // const filteredPokemon = searchvalue
    // ? first151Pokemon.filter((ele, eleIndex) => {
    //     return (
    //       getFullPokedexNumber(eleIndex).includes(searchvalue) ||
    //       ele.toLowerCase().includes(searchvalue.toLowerCase())
    //     );
    //   })
    // : [];
  

  return ( 
    <nav className={' ' + (!showSideMenu ? " open" : '')}>
            <div className={"header " + (!showSideMenu ? " open" : '')} >
                <button onClick={handleCloseMenu} className="open-nav-button">
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokédex</h1>
            </div>

        <input placeholder="E.g. 001 or Bulba..." value={searchvalue} onChange={(e) => setsearchvalue(e.target.value)} />
        {filteredPokemon.map((pokemon, pokemonindex) => {
             const truePokedexNumber = first151Pokemon.indexOf(pokemon)
            return (
                <button onClick={() => setpokemonselected(truePokedexNumber)} key={pokemonindex} className={"nav-card" + (pokemonindex === pokemonselected ? 'new-card-select':'') }  >
                    <p>{getFullPokedexNumber(truePokedexNumber)}</p>
                    <p>{pokemon}</p>
                </button>
            )
        })}
    </nav>
  )
}

