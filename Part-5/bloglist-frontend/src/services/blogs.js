import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const request = axios.get(baseUrl)
    const response = await request
    return response.data
}

const createBlog = async newBlog => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, newBlog, config)

    return response.data
}

const increaseLikes = async updatedBlog => {
    const response = await axios.put(
        `${baseUrl}/${updatedBlog.id}`,
        updatedBlog
    )

    return response.data
}

const deleteBlog = async blogToDelete => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.delete(
        `${baseUrl}/${blogToDelete.id}`,
        config
    )

    return response.data
}

export default { getAll, setToken, createBlog, increaseLikes, deleteBlog }
