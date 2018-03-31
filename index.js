const path = require('path');
process.env.GOOGLE_APPLICATION_CREDENTIAL = path.join(__dirname, './api_key', 'Analysis.json');
var record = require('node-record-lpcm16');
var fs = require('fs');
const speech = require('@google-cloud/speech');
 
var file = fs.createWriteStream('test.wav', { encoding: 'binary' })
 
record.start().pipe(file)
 
// Stop recording after three seconds 
setTimeout(function () {
  record.stop()
}, 5000);


	// The name of the audio file to transcribe
const fileName = './test.wav';

// Reads a local audio file and converts it to base64
const fileR = fs.readFileSync(fileName);
const audioBytes = fileR.toString('base16');
const client = new speech.SpeechClient({
  projectId: 'analysis-1522524411029',
  keyFilename: path.join(__dirname, './api_key', 'Analysis.json'),
});



const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };
  
  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    })
  