import 'dotenv/config';
import server from "./server";
import path from 'path';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('server listening on port:', PORT);
});