import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, toggleNotification, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [fullDetails, setFullDetails] = useState(false)

  const toggleDetails = () => {
    setFullDetails(!fullDetails)
  }

  const likeBlog = async () => {
    const blogObject = {
      body: {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id
      },
      id: blog.id
    }
    const likedBlog = await blogService.like(blogObject)
    const blogToUpdate = blogs.find(blog => blog.id === likedBlog.id)
    const updatedBlog = { ...blogToUpdate, likes: likedBlog.likes }
    const updatedBlogs = blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
    const sortedBlogs = updatedBlogs.sort((a,b) => (a.likes > b.likes) ? -1 : 1)
    setBlogs(sortedBlogs)
  }

  const removeBlog = async () => {
    const blogToRemove = blog
    if (window.confirm(`Do you really want to delete ${blogToRemove.name} permanently?`)) {
      await blogService.remove(blog.id)
      const updatedBlogs = blogs.filter(blog => blog.id !== blogToRemove.id)
      const sortedBlogs = updatedBlogs.sort((a,b) => (a.likes > b.likes) ? -1 : 1)
      toggleNotification('deleted', 'success')
      setBlogs(sortedBlogs)
    }
  }

  const minimizedView = () => (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button id="show-details" onClick={toggleDetails}>show</button>
    </div>
  )

  const detailedView = () => (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleDetails}>hide</button><br></br>
      {blog.url}<br></br>
      likes: {blog.likes} <button id="like-blog" onClick={likeBlog}>like</button><br></br>
      {blog.user.name}<br></br>
      {blog.user.username === user.username ? <button id="delete-blog" onClick={removeBlog}>delete</button> : <div></div>}
    </div>
  )

  if (fullDetails) {
    return detailedView()
  } else {
    return minimizedView()
  }
}

export default Blog
