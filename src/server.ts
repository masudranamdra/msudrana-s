import dotenv from 'dotenv';
import dns from 'dns';

// Load env variables
dotenv.config();

// Fix DNS resolution issues on Windows for MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

import app from './app';
import { connectDB } from './config/db';

const startServer = async (): Promise<void> => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer().catch((err: Error) => {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });
}

export default app;
