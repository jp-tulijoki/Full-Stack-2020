const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  { 
    title: "React patterns", 
    author: "Michael Chan", 
    url: "https://reactpatterns.com/", 
    likes: 7 
  }
]

const testUser = {
  username: "testuser",
  name: "test user",
  password: "password"
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  testUser,
  blogsInDb,
  usersInDb
}