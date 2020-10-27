import React from 'react'

const PersonAndNumber = ({name, number}) => {
  return (
    <div>{name} {number}</div>
    )
}

const PersonList = ({personsToShow}) => {
  return (
      <div>
        <ul>
          {personsToShow.map(person =>
            <PersonAndNumber key={person.name} 
            name={person.name} number={person.number} />
          )}
        </ul>
      </div>
    )
}

export default PersonList