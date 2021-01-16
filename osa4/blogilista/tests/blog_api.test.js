const { TestScheduler } = require('jest')
const { before } = require('lodash')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
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

  await api
    .post('/api/blogs')
    .send(newBlog)
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

  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogsAfterPost = await helper.blogsInDb()
  const addedBlog = blogsAfterPost.pop()
  expect(addedBlog.likes).toBe(0)
})

test('blog without title or url are not added', async () => {
  const noTitle = {
    author: "Robert C. Martin", 
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html"
  }

  await api
    .post('/api/blogs')
    .send(noTitle)
    .expect(400)

  const noUrl = {
    title: "First class tests", 
    author: "Robert C. Martin" 
  }

  await api
    .post('/api/blogs')
    .send(noUrl)
    .expect(400)

  const blogsAfterPost = await helper.blogsInDb()
  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length)
})

test('blog can be deleted', async () => {
  const blogsBeforeDelete = await helper.blogsInDb()
  const id = blogsBeforeDelete[0].id
  
  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

  const blogsAfterDelete = await helper.blogsInDb()
  expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1)  
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