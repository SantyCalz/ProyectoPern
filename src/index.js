import app from './app.js';
import { PORT } from './config.js';

// Start server and add error handling for common issues (like EADDRINUSE)
const server = app.listen(PORT, () => {
    console.log('Server on port', PORT);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. If you need to run this app now, either stop the process using that port or set a different PORT environment variable.`);
        console.error('On Windows you can run: netstat -ano | findstr :'+PORT+'  (then taskkill /PID <pid> /F)');
        process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
});