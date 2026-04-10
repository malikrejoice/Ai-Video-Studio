import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const pythonServerUrl = process.env.PYTHON_AI_SERVER_URL || 'http://localhost:6000';
const port = process.env.PORT || 5000;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || `http://localhost:${port}`;

app.post('/generate', async (req, res) => {
  const { prompt, duration, aspectRatio, style, images } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await axios.post(
      `${pythonServerUrl}/generate`,
      {
        prompt,
        duration,
        aspectRatio,
        style,
        images,
      },
      {
        timeout: 15 * 60 * 1000,
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.error || 'Failed to generate video from AI server.';
    console.error('AI server generate error:', error?.response?.data || error.message);
    return res.status(status).json({ error: message });
  }
});

app.get('/status/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const response = await axios.get(`${pythonServerUrl}/status/${jobId}`, {
      timeout: 15 * 60 * 1000,
    });

    const data = response.data;
    if (data.video) {
      data.videoUrl = `${apiBaseUrl}/outputs/${data.video}`;
    }

    return res.status(response.status).json(data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.error || 'Failed to fetch job status from AI server.';
    console.error('AI server status error:', error?.response?.data || error.message);
    return res.status(status).json({ error: message });
  }
});

app.get('/outputs/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const response = await axios.get(`${pythonServerUrl}/outputs/${filename}`, {
      responseType: 'stream',
      timeout: 15 * 60 * 1000,
    });

    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      if (key.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(key, value);
    });
    response.data.pipe(res);
  } catch (error) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.error || 'Failed to proxy AI output file.';
    console.error('AI server output proxy error:', error?.response?.data || error.message);
    res.status(status).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
