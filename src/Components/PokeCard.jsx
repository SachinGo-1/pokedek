import { useState, useEffect } from "react";
import { getPokedexNumber, getFullPokedexNumber } from "../Utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard(props) {
  const { pokemonselected } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState()
  const [loadingSkill, setLoadingSkill] = useState(false)

  const { name, height, abilities, stats, types, moves, sprites } = data || {}

  const imglist = Object.keys(sprites || {}).filter((val) => {
    if(!sprites[val]) { return false }
    if (['versions', 'other'].includes(val)) { return false }
    return true
  }) 

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) { return }

    // check cache for move
    let c = {}
    if (localStorage.getItem('pokemon-moves')) {
        c = JSON.parse(localStorage.getItem('pokemon-moves'))
    }

    if (move in c) {
        setSkill(c[move])
        console.log('Found move in cache')
        return
    }

    try {
        setLoadingSkill(true)
        const res = await fetch(moveUrl)
        const moveData = await res.json()
        console.log('Fetched move from API', moveData)
        const description = moveData?.flavor_text_entries.filter(val => {
            return val.version_group.name == 'firered-leafgreen'
        })[0]?.flavor_text

        const skillData = {
            name: move,
            description
        }
        setSkill(skillData)
        c[move] = skillData
        localStorage.setItem('pokemon-moves', JSON.stringify(c))
    } catch (err) {
        console.log(err)
    } finally {
        setLoadingSkill(false)
    }
}

  useEffect(() => {

    if (loading || !localStorage) {
      return;
    }

    let cache = {};
    if (localStorage.getItem("pokedek")) {
      cache = JSON.parse(localStorage.getItem("pokedek"));
    }

    if (pokemonselected in cache) {
      setData(cache[pokemonselected]);
      return;
    }

    async function fetchpokemondata() {
      try {
        const baseurl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + getPokedexNumber(pokemonselected);
        const fullUrl = baseurl + suffix;
        const res = await fetch(fullUrl);
        const pokemondata = await res.json();
        setData(pokemondata);
        console.log(pokemondata);
        cache[pokemonselected] = pokemondata;
        localStorage.setItem("pokedek", JSON.stringify(cache));
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchpokemondata();

  }, [pokemonselected]);

  if (!data) {
    return (
        <div>
            <h4>Loading...</h4>
        </div>
    )
}

  return (
    
    <div className="poke-card">
             {skill && (
                <Modal handleCloseModal={() => { setSkill(null) }}>
                    <div>
                        <h6>Name</h6>
                        <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description}</p>
                    </div>
                </Modal>
            )}
       <div>
            <h4>#{getFullPokedexNumber(pokemonselected)}</h4>
            <h2>{name}</h2>
        </div>
        <div className="type-container">
            {types.map((moveObj, typeindex) => {
                return (
                    <TypeCard key={typeindex} type={moveObj?.type?.name} />
                )
            })}
        </div>
        <div className="default-img">
            <img src={'/pokemon/' + getFullPokedexNumber(pokemonselected) + '.png'} alt={`${name}-large-img`} />
        </div>
        <div className="img-container">
            {imglist.map((spriteUrl, spritesIndex) => {
                const imgurl = sprites[spriteUrl]
                return (
                    <img key={spritesIndex} src={imgurl} alt={`${name}-image-${spriteUrl}`} />
                )
            })}
        </div>
        <h3>Stats</h3>
        <div className="stats-card">
        {stats.map((statobj, statIndex) => {
           const {stat, base_stat} = statobj
            return (
                <div key={statIndex} className='stat-item'>
                    <p>{stat?.name.replaceAll('-', ' ')}</p>
                    <h4>{base_stat}</h4>
                </div>
            )
        })
        }
        </div>
        <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className='button-card pokemon-move' key={moveIndex} onClick={() => fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)} >
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>

    </div>
  );
}
