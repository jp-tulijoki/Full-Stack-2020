import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import App from '../App'
import blogService from '../services/blogs'

test('blog creation function is called with right props', () => {
  let component = render(
    <BlogForm blogs={App.blogs} setBlogs={App.setBlogs}
      toggleNotification={App.toggleNotification}/>
  )

  const mockHandler = jest.spyOn(blogService, 'create')

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'test blog' }
  })
  fireEvent.change(author, {
    target: { value: 'test author' }
  })
  fireEvent.change(url, {
    target: { value: 'test url' }
  })
  fireEvent.submit(form)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('test blog')
  expect(mockHandler.mock.calls[0][0].author).toBe('test author')
  expect(mockHandler.mock.calls[0][0].url).toBe('test url')
})
