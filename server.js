import { createServer } from 'http';

import app from './app'

// set up the server
const port = parseInt(process.env.PORT, 10) || 8080;

app.set('port', port);

const server = createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
