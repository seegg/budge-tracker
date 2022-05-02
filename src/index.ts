import 'dotenv/config';
import app from "./server";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('server listening on port:', PORT);
});

process.on('SIGTERM', () => {
  server.close((err) => {
    console.error(err);
    process.exit();
  })
});