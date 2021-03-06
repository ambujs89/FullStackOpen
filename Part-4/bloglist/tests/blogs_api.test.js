const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)

const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./test_helper")

const tester2 = {
   username: "tester2",
   name: "tester2",
   password: "tester#234",
}

const newTester = {
   username : "temptester345",
   name : "temptester",
   password : "pass#123"
}

const weaktester = {
   username : "weak",
   name : "very weak",
   password : "weak"
}

let token = ""

testersArr = [
   {
      _id: "62c49064e95cd4d41fb411ea",
      username: "tester",
      name: "tester tester",
      passwordHash:
         "$2b$10$dPNr.xGDGHhQH7BMi6PgkeyNVgyBlIETmj9PgBBsKJXpnCl58gmoG",
      blogs: [],
      __v: 0,
   },
]

beforeAll(async () => {
   await Blog.deleteMany()
   await Blog.insertMany(helper.initialBlogs)
   await User.findByIdAndDelete("62c49064e95cd4d41fb411ea")
   await User.findOneAndDelete({username : "temptester345"})
   await User.insertMany(testersArr)
})

test("blogs are returned as json", async () => {
   await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
})

test("blogs have id and not _id", async () => {
   const response = await api.get("/api/blogs")

   // ? does not check each object
   expect(response.body[0].id).toBeDefined()
})

describe("User signup and login", () => {
   test("should give status code 201 when signing up", async () => {
      await api.post("/api/users").send(newTester).expect(201)
   })
   test("should throw error when signing up with existing username", async () => {
      const response = await api.post("/api/users").send(tester2)

      expect(response.body).toEqual({ error: "username must be unique" })
   })
   test('should throw error when signing up with weak password', async () => { 
      const response = await api.post("/api/users").send(weaktester)

      expect(response.body).toEqual({error : "password must have at least 8 characters, including digits and symbols."})
    })
    
   test("should give back token when logging in", async () => {
      const response = await api.post("/api/login").send(tester2)
      token = response.body.token

      expect(response.body.token).toBeDefined()
   })
   test('should throw error when logging in with wrong passsord or username', async () => { 
      const response = await api.post("/api/login").send({...tester2, password : "wrongpass"})
      
      expect(response.body).toEqual({
         error: "invalid username or password",
      })
    })
})

// const token =
//    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhpcHBvTWFuaWFjNDkzIiwiaWQiOiI2MmMwMjM0YmNlZTlhYTg3ZGJkMzExZmEiLCJpYXQiOjE2NTcwNDg4NTAsImV4cCI6MTY1NzEzNTI1MH0.uVLJcfYZ82ajep8f0MR5U4yQLFpCC9eoDhsoz3bKLFE"

describe("when POSTing a blog", () => {
   test("number of blogs is +1", async () => {
      await api
         .post("/api/blogs")
         .set({ Authorization: `bearer ${token}`, Accept: "application/json" })
         .send(helper.testBlogWithLikes)
         .expect(201)

      const afterPost = await api.get("/api/blogs")
      expect(afterPost.body).toHaveLength(helper.initialBlogs.length + 1)
   })

   test("new blog is in the list", async () => {
      const request = await api
         .post("/api/blogs")
         .set({ Authorization: `bearer ${token}`, Accept: "application/json" })
         .send(helper.testBlogWithLikes)
      const afterPost = await api.get("/api/blogs")

      expect(afterPost.body).toContainEqual(request.body)
   })

   test("blog without likes defaults likes = 0", async () => {
      const request = await api
         .post("/api/blogs")
         .set({ Authorization: `bearer ${token}`, Accept: "application/json" })
         .send(helper.testBlogWithoutLikes)

      expect(request.body.likes).toEqual(0)
   })

   test("malformatted blog gives code 400", async () => {
      await api.post("/api/blogs")
      .set({ Authorization: `bearer ${token}`, Accept: "application/json" })
      .send(helper.malformattedBlog).expect(400)
   })
})

describe("GETting a blog by ID", () => {
   test("correct id gives status code 200", async () => {
      const result = await api.get("/api/blogs/5a422b891b54a676234d17fa")

      expect(result.status).toEqual(200)
   })
   test("non existing id gives status code 400", async () => {
      await api.get("/api/blogs/asdlkfj1091").expect(400)
   })
   test("incorrect id format gives status code 404", async () => {
      await api.get("/api/blogs/62bb21187c594ff40b94c8ad").expect(404)
   })
   test("has expected title wrt id", async () => {
      const blog = await api.get("/api/blogs/5a422b891b54a676234d17fa")

      expect(blog.body.title).toEqual("First class tests")
   })
})

describe("DELETEing a blog by ID", () => {
   test("gives status code 204", async () => {
      const response = await api
      .delete("/api/blogs/5a422b3a1b54a676234d17f9")
      .set({ Authorization: `bearer ${token}`, Accept: "application/json" })
      .expect(204)

   })
})

describe("PUTting a blog by ID", () => {
   test("updated likes is same as PUT likes", async () => {
      likesTo = 24
      const result = await api
         .put("/api/blogs/5a422b3a1b54a676234d17f9")
         .send({ likes: `${likesTo}` })

      expect(result.body.likes).toEqual(likesTo)
   })
})

afterAll(() => {
   mongoose.connection.close()
})
