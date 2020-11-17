import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import PersonList from './components/PersonList'
import personService from './services/persons'
import './App.css'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ successMessage, setSuccessMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

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
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from the server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedData => {
          setPersons(persons.concat(returnedData))  
      })
      setSuccessMessage(`Added ${newName}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
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

  const SuccessMessage = ({ message }) => {
    if (message === null) {
      return null
    } 

    return (
      <div className="success">
        { message }
      </div>
    )
    
  }

  const ErrorMessage = ({ message }) => {
    if (message === null) {
      return null
    } 

    return (
      <div className="error">
        { message }
      </div>
    )
    
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <SuccessMessage message={successMessage} />
      <ErrorMessage message={errorMessage} />
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