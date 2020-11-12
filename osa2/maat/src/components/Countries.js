import React from 'react'

const ShowCountryList = ({countriesToShow, handleButtonClick}) => {
  return (
      <div>
        <ul>
          {countriesToShow.map(country => <div key={country.name}>
            {country.name}
            <button onClick={() => handleButtonClick(country.name)}>show</button>
            </div>)}    
        </ul>
      </div>
    )
}

const ShowOneCountry = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>
          {language.name}</li>)}
      </ul>
      <img src={country.flag} height="100"></img>
    </div>
  )
} 

const Countries = ({countriesToShow, handleButtonClick}) => {
  if (countriesToShow.length > 10) {
    return (
      <div>
        Too many matches, be more specific.
      </div>
    )
  } else if (countriesToShow.length > 1) {
    return (
      <ShowCountryList countriesToShow={countriesToShow} handleButtonClick={handleButtonClick}/>
    )
  } else if (countriesToShow.length === 1){
    return (
      <ShowOneCountry country={countriesToShow[0]} />
    )
  } else {
    return (
    <div>
      No matches at the moment.
    </div>
    )
  }
}

export default Countries
