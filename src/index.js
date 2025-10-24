import app from './app.js';

// Usar puerto dinámico de Render o fallback 5000
const PORT = process.env.PORT || 5000;

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the process using that port or set a different PORT.`);
        process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
});
