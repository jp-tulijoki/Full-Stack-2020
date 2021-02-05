import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const update = async (objectToUpdate) => {
  const id = objectToUpdate.id
  const response = await axios.put(`${baseUrl}/${id}`, objectToUpdate)
  return response.data
}

export default { getAll, create, update }