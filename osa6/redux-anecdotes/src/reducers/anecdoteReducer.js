import anecdoteService from "../services/anecdotes"
import { setNotification } from '../reducers/notificationReducer'

const anecdoteReducer = (state = [], action) => {
  switch(action.type) {
    case 'VOTE':
      const id = action.data.id
      const votedAnecdote = state.find(anecdote => anecdote.id === id)
      const updatedAnecdote = {
        ...votedAnecdote,
        votes: votedAnecdote.votes + 1
      }
      return state.map(anecdote => anecdote.id === id 
        ? updatedAnecdote : anecdote)
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT':
      return action.data
    default:
      return state
  }
}

export const vote = (anecdote) => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService
      .update({...anecdote, votes: anecdote.votes + 1})
    const id = votedAnecdote.id
    await dispatch({
      type: 'VOTE',
      data: { id }
    })
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: {
        content,
        votes: 0
      }
    })
    dispatch(setNotification(`created '${newAnecdote.content}'`, 5))
  }
}

export const initializeAnecdotes = () => {
  return  async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT',
      data: anecdotes
    })
  }
}

export default anecdoteReducer