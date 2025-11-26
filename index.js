const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middle-ware
app.use(cors());


app.get('/', (req, res) => {
    res.send('Server is running.....');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
