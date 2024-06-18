const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const docker = new Docker();

const languages = require('./languages.json');
console.log("Loaded languages.");

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());  // This enables CORS for all origins

const PORT = 3000;


async function ensureImageExists(imageName) {
    try {
        await docker.getImage(imageName).inspect();
    } catch (error) {
        if (error.statusCode === 404) { // Image not found
            console.log(`Image ${imageName} not found locally. Pulling from Docker Hub...`);
            await new Promise((resolve, reject) => {
                docker.pull(imageName, (err, stream) => {
                    if (err) {
                        reject(err);
                    } else {
                        docker.modem.followProgress(stream, onFinished, onProgress);

                        function onFinished(err, output) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(output);
                            }
                        }

                        function onProgress(event) {
                            console.log(event.status);
                        }
                    }
                });
            });
        } else {
            throw error;
        }
    }
}

app.post('/run-code', async (req, res) => {
    const { code, languageName } = req.body;
    const language = languages.find(lang => lang.name === languageName);

    if (!language) {
        return res.status(400).send('Language not supported or not found.');
    }

    try {
        await ensureImageExists(language.dockerImage);

        const container = await docker.createContainer({
            Image: language.dockerImage,
            Cmd: [...language.runCommand, code],
            AttachStdout: true,
            AttachStderr: true
        });
    
        await container.start();

        // Set a timeout to stop the container if it runs too long
        const timeoutHandle = setTimeout(async () => {
            try {
                console.log(`Timeout reached. Stopping container...`);
                await container.stop();
                await container.remove();
            } catch (error) {
                console.error('Error stopping container after timeout:', error);
            }
        }, EXECUTION_TIMEOUT);

        const output = await new Promise((resolve, reject) => {
            container.logs({
                follow: true,
                stdout: true,
                stderr: true
            }, (err, stream) => {
                if (err) {
                    clearTimeout(timeoutHandle);  // Clear the timeout if there is an error
                    return reject(err);
                }
                const chunks = [];
                stream.on('data', (chunk) => chunks.push(chunk.toString()));
                stream.on('end', () => {
                    clearTimeout(timeoutHandle);  // Clear the timeout when execution completes
                    resolve(chunks.join(''));
                });
            });
        });

        await container.stop();
        await container.remove();

        res.send({ output });
    } catch (error) {
        console.error('Docker Error:', error);
        res.status(500).send('Failed to execute code in Docker: ' + error.message);
    }
    
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
