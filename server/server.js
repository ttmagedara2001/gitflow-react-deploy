const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());

// Serve the compiled React static files from the build stage
app.use(express.static(path.join(__dirname, '../dist')));

// API Endpoint to fetch genuine container metrics
app.get('/api/metrics', async (theme, res) => {
  try {
    const memory = await si.mem();
    const currentLoad = await si.currentLoad();
    
    res.json({
      cpu: Math.round(currentLoad.currentLoad),
      memory: Math.round((memory.active / memory.total) * 100),
      uptime: Math.round(process.uptime()),
      platform: process.platform
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch container metrics" });
  }
});

// Fallback to route everything else to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Metrics server running on port ${PORT}`);
});