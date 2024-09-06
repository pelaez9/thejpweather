import path from 'node:path';
import { Router, Request, Response } from 'express';

const router = Router();

// Serve index.html using an absolute path with enhanced error handling
router.get('/', (_: Request, res: Response) => {
  const indexPath = path.resolve('client/index.html');
  console.log('Serving index.html from:', indexPath); // Debugging line

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err); // More detailed error logging
      
      // If `err` is an instance of an HTTP error, it might have a status property
      const statusCode = (err as any).status || 500;
      res.status(statusCode).send('Internal Server Error');
    }
  });
});

export default router;
