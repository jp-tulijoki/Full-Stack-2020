import React from 'react'

const PersonAndNumber = ({name, number, id , removePerson}) => {
  return (
    <div>{name} {number}<button onClick={() => removePerson(id)}>delete</button></div>
    )
}

const PersonList = ({personsToShow, removePerson}) => {
  return (
      <div>
        <ul>
          {personsToShow.map(person =>
            <PersonAndNumber key={person.id} 
            id={person.id} name={person.name} number={person.number} removePerson={removePerson}/>
          )}
        </ul>
      </div>
    )
}

export default PersonList