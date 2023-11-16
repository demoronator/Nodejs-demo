const express = require('express');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());

// Use the userRoutes for any requests to '/users'
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
});
