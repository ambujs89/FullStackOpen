const Blog = require("../models/blog")

const initialBlogs = [
   {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      user : "62c4b7f13a3f5afc7e804e44",
      likes: 7,
      __v: 0,
   },
   {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      user : "62c4b7f13a3f5afc7e804e44",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
   },
   {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      user : "62c4b7f13a3f5afc7e804e44",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
   },
   {
      _id: "5a422b891b54a676234d17fa",
      user : "62c4b4e0060ecc0fc335fe97",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
   },
   {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      user : "62c4b4e0060ecc0fc335fe97",
      __v: 0,
   },
   {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      user : "62c4b4e0060ecc0fc335fe97",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0,
   },
]

const testBlogWithLikes = {
   title: "might delete soon",
   url: "nowhere",
   author: "noOne",
   user : "62c4af8259c98bbf0a034475",
   likes: 69,
}

const testBlogWithoutLikes = {
   title: "might probably delete soon",
   url: "someWebSite",
   user : "62c4af8259c98bbf0a034475",
   author: "someOne",
}

const malformattedBlog = {
   title : "something is wrong"
}

const nonExistingId = async () => {
   const blog = new Blog({
      title: "willremovethissoon",
      author: "nobody",
      url: "https://www.nowhere.com/",
   })
   await blog.save()
   await blog.remove()

   return blog._id.toString()
}

const blogsInDb = async () => {
   const blogs = await Blog.find({})
   return blogs.map((blog) => blog.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDb, testBlogWithLikes, testBlogWithoutLikes, malformattedBlog }
