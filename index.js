const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))
app.use(express.json())
app.use(cors())
app.use(express.static("dist"))

morgan.token("data", (request, response) => {
  // Not sure if this was the goal, but only log the content of POST requests
  return request.method === "POST" ? JSON.stringify(request.body) : null
})

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}`)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
      response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  const names = persons.map(person => person.name)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing"
    })
  } else if (names.includes(body.name)) {
    return response.status(400).json({
      error: "This person already exists in the phonebook"
    })
  }

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: Number(body.number),
  }

  persons = persons.concat(person)
  response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
