const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); 
const { metricsMiddleware, metricsHandler } = require('./middlewares/metricsMiddleware');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de métriques Prometheus
app.use(metricsMiddleware);

// Endpoint de métriques pour Prometheus
app.get('/metrics', metricsHandler);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use("/api/reviews", require("./routes/reviewRoutes"));




connectDB();





// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
