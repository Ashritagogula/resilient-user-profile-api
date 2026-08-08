const express = require('express');

const app = express();
const PORT = process.env.PORT || 8081;
const MOCK_FAILURE_RATE = parseFloat(process.env.MOCK_FAILURE_RATE || "0.0");
const MOCK_LATENCY_MS = parseInt(process.env.MOCK_LATENCY_MS || "50", 10);

app.get('/enrich', async (req, res) => {
  const userId = req.query.userId;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Simulate latency
  if (MOCK_LATENCY_MS > 0) {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));
  }

  // Simulate random failure
  if (Math.random() < MOCK_FAILURE_RATE) {
    return res.status(503).json({ error: 'Service Unavailable' });
  }

  return res.status(200).json({
    recentActivity: ["login", "view_item"],
    loyaltyScore: 450
  });
});

app.listen(PORT, () => {
  console.log(`Mock service listening on port ${PORT}`);
});
