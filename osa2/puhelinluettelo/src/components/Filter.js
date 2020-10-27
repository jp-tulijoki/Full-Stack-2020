import React from 'react'

const Filter = ({newFilter, setFilter}) => {
  return (
    <div>
      filter names with: <input
        value={newFilter}
        onChange={setFilter}
      />
    </div>
    )
}

export default Filter