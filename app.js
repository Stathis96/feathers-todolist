const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

class ListService {
  constructor() {
    this.lists = []
  }
  async find() {
    return this.lists;
  }

  async create(data) {
    const list = {
      id: this.lists.length,
      title: data.title,
      slug: data.slug,
      tasks: data.tasks
    };


    this.lists.push(list);

    return list;
  }
}


// Idea Service
// class IdeaService {
//   constructor() {
//     this.ideas = [];
//   }

//   async find() {
//     return this.ideas;
//   }

//   async create(data) {
//     const idea = {
//       id: this.ideas.length,
//       text: data.text,
//       tech: data.tech,
//       viewer: data.viewer
//     };

//     idea.time = moment().format('h:mm:ss a');

//     this.ideas.push(idea);

//     return idea;
//   }
// }

const app = express(feathers());

// Parse JSON
app.use(express.json());
// Config Socket.io realtime APIs
app.configure(socketio());
// Enable REST services
app.configure(express.rest());
// Register services
// app.use('/ideas', new IdeaService());
app.use('/lists', new ListService());

// New connections connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));
// Publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app
  .listen(PORT)
  .on('listening', () =>
    console.log(`Realtime server running on port ${PORT}`)
  );

// app.service('ideas').create({
//   text: 'Build a cool app',
//   tech: 'Node.js',
//   viewer: 'John Doe'
// });
app.service('lists').create({
  title: 'List Title',
  slug: 'Original Slug',
  tasks: 'Example Task'
});
