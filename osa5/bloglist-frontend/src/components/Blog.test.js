import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'
import App from '../App'
import blogService from '../services/blogs'

describe('Bloglist tests', () => {

  let component

  const blog = {
    title: 'test blog',
    author: 'test expert',
    url: 'www.test.test',
    likes: 7,
    user: {
      username: 'user',
      name: 'test user',
      id: '6012de99f7e2ad346a458c26'
    },
    id: '6014670eaf76c917176db81f'
  }

  beforeEach(() => {
    component = render(
      <Blog key={blog.id} blog={blog} blogs={App.blogs}
        setBlogs={App.setBlogs} toggleNotification={App.toggleNotification}/>
    )
  })

  test('defalt view renders blog title and author', () => {
    expect(component.container).toHaveTextContent('test blog')
    expect(component.container).toHaveTextContent('test expert')
    expect(component.container).not.toHaveTextContent('www.test.test')
    expect(component.container).not.toHaveTextContent('likes')
  })

  test('detailed view shows url and likes', () => {
    const button = component.getByText('show')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('www.test.test')
    expect(component.container).toHaveTextContent('likes')
  })

  test('event handler for like button is called twice with two clicks', () => {
    const mockHandler = jest.spyOn(blogService, 'like')

    let button = component.getByText('show')
    fireEvent.click(button)

    button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})