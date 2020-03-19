// Open and connect input socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', () => {
  console.log("Connected", socket.id);
});

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  // Disable canvas by deafult
  cnv.addClass('disabled');

  // Text styling
  textAlign(LEFT, TOP);
  textSize(32);

  //Create input if chosen to write a story
  socket.on('hint', () => {
    // Enable canvas
    cnv.removeClass('disabled');
    writeStory();
  });

  // Listen for button press to next
  socket.on('update', (data) => {
    cnv.removeClass('disabled');
    //data strcuture from server is {countdown: 0, word: ''}
    let count = data.countdown;
    let word = data.word;

    if (count == 0) {
      //if you say the word, press button that says finish
      fill(255, 0, 0);

      let doneButton = createButton('finish');
      doneButton.position(20, 65);

      //When the button is pressed, emit "finish"
      doneButton.mousePressed(() => {
        socket.emit('finish');
      });

    } else if (count == 1) {
      fill(50);
    } else if (count == 2) {
      fill(125);
    } else {
      fill(200);
    }
    //If there is data.word, print the word. If not, direct client to listen.
    text(data.word ? data.word : 'listen carefully...', 10, 10);

  });

  socket.on('end', () => {
    endStory()
  })

  function writeStory(hint) {
    //Prompt asking users to input sentences. Text can be edited of course.
    let prompt = createElement('h2', 'Tell us 4 sentence story a story about your' + hint);
    prompt.position(20, 5);

    let input = createInput();
    input.position(20, 65);

    let button = createButton('submit');
    button.position(input.x + input.width, 65);

    //When the button is pressed, emit the input value as a string and return the value to the server
    button.mousePressed(() => {
      const story = input.value('');
      socket.emit('submit', {
        hint: hint,
        article: story,
      });
    });
  }

  function endStory() {
    //'Show an interesting question?'
    text('Whats your story, baybeee?', 10, 10);
  }
}
