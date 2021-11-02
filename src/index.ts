import express from 'express'
import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongoose'

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.get('/', (request, response) => {
  response.send('hello world!')
})

app.get('/todos',  async (request, response) => {
  const todos = await getAllTodos()

  response.status(200)
  response.send(todos)
})

app.post('/todos', (request, response) => {
  const body = request.body

  if (body.title && body.description) {
    createTodo({ ...body })

    response.status(200)
    response.send()
  } else {
    response.status(422)
    response.send('you must send a complete todo')
  }

  response.status(201)
  response.send();
})

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`)
})

type todo = {
  _id: ObjectId
  title: string
  description: string
}

const createTodo = async (todo: { 'title': string, 'description': string }) => {
  const uri = "mongodb+srv://user:password@intro-node.fyzdp.mongodb.net/todo-node?retryWrites=true&w=majority"
  const client = await MongoClient.connect(uri);

  client.connect(async (error) => {
      if (!error) {
        const todos = client.db("todo-node").collection("todos")
        
        await todos.insertOne(todo)
  
        client.close()
      }
  })
}

const getAllTodos = async () => { 
  const uri = "mongodb+srv://user:password@intro-node.fyzdp.mongodb.net/todo-node?retryWrites=true&w=majority"
  const client = await MongoClient.connect(uri);

  client.connect((error) => {
    if (!error) {
      console.log('database connected')
    }
  })

  const todos = client.db("todo-node").collection("todos")
  const todosList: todo[] = await todos.find({}).toArray() as todo[]

  client.close()
        
  return todosList
}