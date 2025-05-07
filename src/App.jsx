import Header from "./Components/Header"
import PokeCard from "./Components/PokeCard"
import SideNav from "./Components/SideNav"
import { useState } from "react"


function App() {
const [pokemonselected, setpokemonselected] = useState(0)
const [showSideMenu, setShowSideMenu] = useState(true)

function handleToggleMenu() {
  setShowSideMenu(!showSideMenu)
}

function handleCloseMenu() { 
  setShowSideMenu(true)
}

  return ( 
    <>
    <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        showSideMenu={showSideMenu}
        pokemonselected={pokemonselected}
        setpokemonselected={setpokemonselected}
        handleCloseMenu={handleCloseMenu} />
    <PokeCard pokemonselected={pokemonselected} />
    </>
  )
}

export default App
