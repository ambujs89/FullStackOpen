const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/userExtractor')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')

    return response.json(blogs).end()
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const authedUser = await request.user
    if (!authedUser.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({ ...request.body, user: authedUser })
    const savedBlog = await blog.save()

    authedUser.blogs = authedUser.blogs.concat(savedBlog._id)
    await authedUser.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const id = String(request.params.id)
    const blog = await Blog.findById(id)
    const authedUser = await request.user

    const userId = await authedUser.id

    if (!blog.user.toString() === userId.toString()) {
        return response
            .status(401)
            .json({
                error: 'Only the creator of the blog can delete this blog',
            })
    }

    await User.updateOne(
        { _id: userId },
        {
            $pullAll: {
                blogs: [{ _id: request.params.id }],
            },
        }
    )
    await Blog.deleteOne({ _id: id })

    return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = await request.body

    const blog = {
        likes: body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
        new: true,
    })

    response.json(updatedBlog)
})

module.exports = blogsRouter
