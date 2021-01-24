const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send(helper.testUser) 
})

test('correct number of blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await helper.blogsInDb()
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length)
})

test('the identifier is called id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('posting adds the right blog', async () => {
  const newBlog = {
    title: "Go To Statement Considered Harmful", 
    author: "Edsger W. Dijkstra", 
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
    likes: 5 
  }

  const login = await api
    .post('/api/login')
    .send(helper.testUser)

  const token = login.body.token
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await helper.blogsInDb()
  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAfterPost.map(blog => blog.title)
  expect(titles).toContain('Go To Statement Considered Harmful')
})

test('undefined likes is initialized to zero', async () => {
  const newBlog = {
    title: "Canonical string reduction", 
    author: "Edsger W. Dijkstra", 
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
  }

  const login = await api
    .post('/api/login')
    .send(helper.testUser)

  const token = login.body.token
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('authorization', `Bearer ${token}`)

  const blogsAfterPost = await helper.blogsInDb()
  const addedBlog = blogsAfterPost.pop()
  expect(addedBlog.likes).toBe(0)
})

test('blog without title or url are not added', async () => {
  const noTitle = {
    author: "Robert C. Martin", 
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html"
  }

  const login = await api
    .post('/api/login')
    .send(helper.testUser)

  const token = login.body.token
  
  await api
    .post('/api/blogs')
    .send(noTitle)
    .set('authorization', `Bearer ${token}`)
    .expect(400)

  const noUrl = {
    title: "First class tests", 
    author: "Robert C. Martin" 
  }

  await api
    .post('/api/blogs')
    .send(noUrl)
    .set('authorization', `Bearer ${token}`)
    .expect(400)

  const blogsAfterPost = await helper.blogsInDb()
  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length)
})

test('blog can not be deleted when unauthorized', async () => {
  const blogsBeforeDelete = await helper.blogsInDb()
  const id = blogsBeforeDelete[0].id

  await api
    .delete(`/api/blogs/${id}`)
    .expect(401)

  const blogsAfterDelete = await helper.blogsInDb()
  expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length)  
})

test('blog can be deleted when authorized', async () => {
  const newBlog = {
    title: "Canonical string reduction", 
    author: "Edsger W. Dijkstra", 
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
  }

  const login = await api
    .post('/api/login')
    .send(helper.testUser)

  const token = login.body.token
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('authorization', `Bearer ${token}`)
  
  const blogsBeforeDelete = await helper.blogsInDb()

  console.log(blogsBeforeDelete)

  const id = blogsBeforeDelete[1].id

  await api
    .delete(`/api/blogs/${id}`)
    .set('authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAfterDelete = await helper.blogsInDb()
  expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length)  
})


test('blog can be updated', async () => {
  const blogsBeforeUpdate = await helper.blogsInDb()
  const blogToBeUpdated = blogsBeforeUpdate[0]
  expect(blogToBeUpdated.likes).toBe(7)

  const updatedBlog = {
    title: blogToBeUpdated.title,
    author: blogToBeUpdated.author,
    url: blogToBeUpdated.url,
    likes: 999
  }

  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAfterUpdate = await helper.blogsInDb()
  expect(blogsAfterUpdate[0].likes).toBe(999)
})

afterAll(() => {
  mongoose.connection.close()
})