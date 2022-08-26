require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger)

const mongoose = require('mongoose')

// const url = `mongodb+srv://Celestial:${password}@cluster0.uvhim2g.mongodb.net/noteApp?retryWrites=true&w=majority`
//Not safe to hardcode the address in here, instead use env file
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

const generateId = () => {
  const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      :0
    return maxId + 1
}

app.post('/api/notes',(request,response,next) => {
  const body = request.body
  
  // if(body.content === undefined) {
  // // or body.content === undefined
  //   return response.status(400).json({
  //     error: 'content missing'
  //   })
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})


app.get('/api/notes',(request,response) => {
  //The notes is not the variable in the top, it just a name,
  //use to assign the array return from Note
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    //This error is pass to the next function
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  // const body = request.body
  const {content, important} = request.body

  // const note = {
  //   content: body.content,
  //   important: body.important,
  // }

  Note.findByIdAndUpdate(
      request.params.id, 
      {content, important}, 
      {new: true, runValidators: true, context: 'query'}
    )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
    // const id = Number(request.params.id)
    // notes = notes.filter(note => note.id !== id)

    // response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  //If the error was a cast error, then it cause from a wrong id
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name ===  'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

// this has to be the last loaded middleware at the end.
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running open port ${PORT}`)
})