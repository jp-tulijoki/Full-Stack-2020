import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint16Array(6))

  const vote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const anecdoteWithMostVotes = () => {
    let mostVotes = 0
    let mostVotesIndex = 0
    for (let i = 0; i<=5; i++) {
      if (votes[i] > mostVotes) {
        mostVotes = votes[i]
        mostVotesIndex = i
      }
    }
    return mostVotesIndex
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}<br />
      has {votes[selected]} votes<br />
      <button onClick={() => vote()}>
        vote
      </button>
      <button onClick={() => setSelected(Math.floor(Math.random() * 6))}>
        next anecdote
      </button>
      <h1>Anecdote with most votes</h1>
      {props.anecdotes[anecdoteWithMostVotes()]}<br />
      has {votes[anecdoteWithMostVotes()]} votes <br />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)