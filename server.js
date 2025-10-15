import app from './app.js'
import env from './src/config/env.js'


app.listen(env.port, env.host, () => {
    console.log(`Server is running on http://${env.host}:${env.port}/`);
});
