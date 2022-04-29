const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
const eventBusEndpoint = 'http://event-bus-srv:4005/events'
app.get('/posts', (req, res) => {
  res.send(posts)
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const {title} = req.body;
  posts[id] = {
    id, title
  };

  await axios.post(eventBusEndpoint, {type:'PostCreated', data:posts[id]}).catch(err => {
    console.log('failed to emmit PostCreated event', {err})
  });
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  const {type} = req.body;
  console.log(`receiving ${type} event`);
  res.send({});
})

const port = 4000
app.listen(port, () => {
  console.log('version 4');
  console.log(`Listening on ${port}`);
});
