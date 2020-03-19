let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function() {
	console.log('Server listening at port: ', port);
});

app.use(express.static('public'));
let io = require('socket.io').listen(server);
let users = {}
let stories = {
  past : [],
  present : [],
  future : []
}
let chosenPast;
let chosenPresent;
let chosenFuture;

let currentStory = [];
let currentQueue = [];

let monitor = io.of("/monitor");
monitor.on("connection",(socket) =>{
  console.log("monitor client connected: " + socket.id );
  // do we need a monitor client?
  monitor.emit("userList", users)
  socket.emit("userList", users)
})

const randInRange = number =>{
  return Math.floor(Math.random()*number);
}

let players = io.of("/player");
players.on("connection", (socket) =>{
  console.log("player connected: " + socket.id)

  users[socket.id] = {}
  monitor.emit("userList", users)

  // hint => start => 3 stories chosen to output
  // everyone tells a story (and only three will get picked)

  // randomly pick a hint to send to the new player
  // hint is "past" "present" or "future"
  let times = ["past", "present", "future"]
  let hint = times[randInRange(3)]
  socket.emit("hint", hint)

  socket.on("submit", (data) => {
    // collect stories in object once we get them
    let storyTime = data.hint
    stories.storyTime.push(data.article)
    console.log(stories.storyTime)
  })

  socket.on("start", () => {
    // get a random example of all three kinds of story
    let numPasts = stories.past.length
    let numPresents = stories.present.length
    let numFutures = stories.future.length

    chosenPast = stories.past[randInRange(numPasts)]
    chosenPresent = stories.past[randInRange(numPresents)]
    chosenFuture = stories.past[randInRange(numFutures)]

    // start with chosenPast story
    // break into one (or two??) word chunks
    currentStory = chosenPast.split(" ")

    // chosenPresent = chosenPresent.split(" ")
    // chosenFuture = chosenFuture.split(" ")

    // pick three sockets to start -- currentQueue
    // send them all "update"

    // break words off the front of the array as we update
  })

  socket.on("finish", () =>{
    // remove countdown 0 socket from queue
    // pick a new socket to add to the end of the queue,
    // "update" all queue-sockets

    // if this is the last finish (no more words in story)
    // emit "end" to everyone ?
    // start next story ?
  })

  socket.on("disconnect",function(){
    console.log("input disconnected" + socket.id)
    // if user is in our queue of three
    // treat as "finish" except don't advance the word

    // otherwise just delete the user
  })
})
