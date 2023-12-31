const mongoose = require("mongoose")

if (process.argv.length<3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.jlwzuvl.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set("strictQuery",false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
  console.log("Phonebook:")
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`Added ${person.name} with number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}





