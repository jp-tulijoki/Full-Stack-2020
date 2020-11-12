import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
  const [data, setData] = useState([])
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setData(response.data)
      })
  }, [])

  const setFilter = (event) => {
    event.preventDefault()
    setNewFilter(event.target.value)
  }

  const countriesToShow = data.filter(item => 
    item.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleButtonClick = (countryName) => {
    setNewFilter(countryName)
  }


return (
  <div>
    <Filter newFilter={newFilter} setFilter={setFilter} />
    <Countries countriesToShow={countriesToShow} handleButtonClick={handleButtonClick}/>
  </div>
)

}
export default App;
