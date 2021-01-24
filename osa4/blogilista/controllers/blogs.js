const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  const token = request.token
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'missing token' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  } else {
  const blog = await Blog.findById(request.params.id)
  const user = await User.findById(decodedToken.id)

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(blog.id)
      response.status(204).end()
    } else {
      response.status(401).json({ error: 'unauthorized to remove this blog' })
    }  
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter