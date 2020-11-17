import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import PersonList from './components/PersonList'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const hook = () => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)  
        })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    if (persons.some(person => person.name === newName)) {
      const oldData = persons.find(person => person.name === newName)
      const newData = { ...oldData, number: newNumber}
      if (window.confirm(`${newName} is already added to the phonebook. Replace old number with the new one?`)) {
        personService
          .update(oldData.id, newData)
          .then(() => {
            setPersons(persons.map(person => person.id !== oldData.id ? person : newData))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedData => {
          setPersons(persons.concat(returnedData))
      
      })
    }
    setNewName('')
    setNewNumber('')
  }
  
  const removePerson = (id) => {
    const personToRemove = persons.find(person => person.id === id)
    if (window.confirm(`Are you sure you want to delete ${personToRemove.name}?`))
    personService
      .remove(id)
        .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        })  
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const setFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter newFilter={newFilter} setFilter={setFilter} />
      <h2>Add new person</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <PersonList personsToShow={personsToShow} removePerson={removePerson}/>
    </div>
  )

}

export default App