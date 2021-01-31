import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ blogs, setBlogs, toggleNotification }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setBlogAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }

  const createBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl
      }
      const blog = await blogService.create(blogObject)
      const updatedBlogs = blogs.concat(blog)
      const sortedBlogs = updatedBlogs.sort((a,b) => (a.likes > b.likes) ? -1 : 1)
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
      setBlogs(sortedBlogs)
      toggleNotification(`Added ${blog.title} by ${blog.author}.`, 'success')
    }
    catch (error) {
      toggleNotification(error.message, 'error')
    }
  }

  return (
    <form onSubmit={createBlog}>
      <div>
        title: <input
          id='title'
          value={blogTitle}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author: <input
          id='author'
          value={blogAuthor}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url: <input
          id='url'
          value={blogUrl}
          onChange={handleUrlChange}
        />
      </div>
      <button id="blog-form-submit" type="submit">add</button>
    </form>
  )
}

BlogForm.propTypes = {
  toggleNotification: PropTypes.func.isRequired
}

export default BlogForm