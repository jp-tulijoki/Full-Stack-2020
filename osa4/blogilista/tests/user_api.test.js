const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'username', name: 'name', passwordHash })

    await user.save()
  })

  test('user creation succeeds with a valid username', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'newusername',
      name: 'newname',
      password: 'newpassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length + 1)

    const usernames = usersAfter.map(user => user.username)
    expect(usernames).toContain(newUser.username)

  })

  test('user creation fails with taken username', async () => {
    const usersBefore = await helper.usersInDb()
    
    const newUser = {
      username: 'username',
      name: 'newname',
      password: 'newpassword'
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('user creation fails with too short username', async () => {
    const usersBefore = await helper.usersInDb()
    
    const newUser = {
      username: 'nu',
      name: 'newname',
      password: 'newpassword'
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('user creation fails with too short password', async () => {
    const usersBefore = await helper.usersInDb()
    
    const newUser = {
      username: 'username',
      name: 'newname',
      password: 'pw'
    }
    
    const post = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      
    expect(post.body.error).toContain('password is too short')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})