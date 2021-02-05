import React from 'react'
import { connect } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>has {anecdote.votes} votes <button onClick={handleClick}>vote</button></div>
    </div>
  )
}

const AnecdoteList = (props) => {
  const anecdotes = props.anecdotes
    .sort((a,b) => (a.votes > b.votes) ? -1 : 1)

const voteAnecdote = (anecdote) => {
  props.vote(anecdote)
}

  return (
    <div>
      {anecdotes.map(anecdote => 
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => 
            voteAnecdote(anecdote)
        }
        />
      )}
    </div>
  )
}

const mapDispatchToProps = {
  vote,
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes.filter(a => a.content.toLowerCase()
      .includes(state.filter.toLowerCase()))
  }
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList