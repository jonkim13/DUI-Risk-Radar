// backend/server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_SPEECH_TO_TEXT_API_KEY;
    const audioFile = req.file.path;

    // Read the audio file and encode it in base64
    const file = fs.readFileSync(audioFile);
    const audioBytes = file.toString('base64');

    const url = `https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${apiKey}`;

    const requestBody = {
        config: {
          encoding: 'WEBM_OPUS',
          languageCode: 'en-US',
        },
        audio: {
          content: audioBytes,
        },
      };

    const response = await axios.post(url, requestBody);

    // Delete the temporary audio file
    fs.unlinkSync(audioFile);

    if (response.data && response.data.results && response.data.results[0]) {
      const transcription = response.data.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      res.json({ transcription });
    } else {
      res.status(400).json({ error: 'No transcription available' });
    }
  } catch (error) {
    console.error('Error during transcription:', error.response?.data || error.message);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
