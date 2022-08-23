const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Celestial:${password}@cluster0.uvhim2g.mongodb.net/noteApp?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  content: String,
  date: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    // const note = new Note({
    //   content: 'Lee',
    //   date: new Date().toString(),
    //   important: true,
    // })

    // return note.save()
    Note.find({}).then(result => {
      //The empty parameter in find means print all result
      //it can be change to Note.find({important: true}) to print only certain info
      result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
    })
  })
  .then(() => {
    console.log('note saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))

// const note = new Note({
//   content: 'Testing again',
//   date: new Date(),
//   important: true,
// })

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   console.log('close connection')
//   mongoose.connection.close()
// })


    // return note.save()
  // })
  // .then(() => {
  //   console.log('note saved!')
  //   return mongoose.connection.close()
