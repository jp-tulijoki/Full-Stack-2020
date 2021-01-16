const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, currentBlog) => {
    return sum + currentBlog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const reducer = (favoriteSoFar, currentBlog) => {
    return favoriteSoFar.likes > currentBlog.likes ? favoriteSoFar : currentBlog
  }
  let favorite = blogs.reduce(reducer, blogs[0])
  return { 
    title: favorite.title, 
    author: favorite.author, 
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  let sort = _.countBy(blogs, 'author')
  return {
    author: Object.keys(sort).pop(),
    blogs: Object.values(sort).pop()
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs, 
}