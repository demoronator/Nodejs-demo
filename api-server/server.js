const express = require('express');
const userRoutes = require('./routes/users');
const logger = require('./logger');

const app = express();
app.use(express.json());

// Use the userRoutes for any requests to '/users'
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`API server listening on port ${PORT}`);
});
