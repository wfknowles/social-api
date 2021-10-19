const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Log mongo queries
mongoose.set('debug', true);

// App Routing
app.use(require('./routes'));

const appServer = app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));

module.exports = {
    app: appServer,
    db: db
};