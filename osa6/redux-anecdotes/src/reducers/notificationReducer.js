const initialState = ""

let timer = null

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET':
      state = ""
      return [...state, action.data.content]
    case 'CLEAR':
      return ""
    default:
      return state
  }
}

export const setNotification = (content, time) => {
  if (timer) {
    clearTimeout(timer)
  }
  return async dispatch => {
    dispatch({
      type: 'SET',
      data: { content }
    })
    timer = setTimeout(() => {
      dispatch({
        type: 'CLEAR'
      })
    }, time * 1000)
  }
}

export default notificationReducer