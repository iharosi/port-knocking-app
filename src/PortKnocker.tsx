import React, { useState } from 'react';
import net from 'net';
import { Container, TextField, Button, Typography } from '@mui/material';

// Constants
const DEFAULT_SERVER_ADDRESS = '127.0.0.1';
const DEFAULT_PORTS = '1001,1002,1003,1004';
const DEFAULT_INTERVAL = '1'; // Default interval in seconds
const FINAL_CONNECTION_PORT = 8080;

const PortKnockingApp: React.FC = () => {
    const [serverAddress, setServerAddress] = useState<string>(DEFAULT_SERVER_ADDRESS);
    const [ports, setPorts] = useState<string>(DEFAULT_PORTS);
    const [interval, setInterval] = useState<string>(DEFAULT_INTERVAL);
    const [status, setStatus] = useState<string>('');

    const sendKnock = () => {
        const portList = ports.split(',').map(port => parseInt(port.trim()));

        const knockPorts = (index: number) => {
            if (index >= portList.length) {
                // All ports have been knocked, now connect to the final port
                const client = new net.Socket();
                client.connect(FINAL_CONNECTION_PORT, serverAddress, () => {
                    setStatus(`Port knocking successful! Connected to port ${FINAL_CONNECTION_PORT}.`);
                    client.end();
                });

                client.on('error', (err) => {
                    console.error(`Error connecting to port ${FINAL_CONNECTION_PORT}: ${err.message}`);
                    setStatus(`Error: Port knocking failed at final connection.`);
                });

                return;
            }

            const client = new net.Socket();
            client.connect(portList[index], serverAddress, () => {
                console.log(`Knocked on port ${portList[index]}`);
                client.end();
                setTimeout(() => knockPorts(index + 1), parseInt(interval) * 1000); // Delay before the next knock
            });

            client.on('error', () => {
                console.log(`Error knocking on port ${portList[index]} - this is expected.`);
                client.destroy();
                setTimeout(() => knockPorts(index + 1), parseInt(interval) * 1000); // Proceed to next port after delay
            });
        };

        setStatus('Port knocking in progress...');
        knockPorts(0);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Port Knocking App
            </Typography>
            <TextField 
                label="Server Address" 
                variant="outlined" 
                fullWidth 
                margin="normal" 
                value={serverAddress}
                onChange={(e) => setServerAddress(e.target.value)}
            />
            <TextField 
                label="Enter comma-separated ports" 
                variant="outlined" 
                fullWidth 
                margin="normal" 
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
            />
            <TextField 
                label="Interval (seconds)" 
                variant="outlined" 
                fullWidth 
                margin="normal" 
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
            />
            <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={sendKnock}
                style={{ marginTop: '1rem' }}
            >
                Knock
            </Button>
            <Typography variant="body1" style={{ marginTop: '1rem' }}>
                Status: {status}
            </Typography>
        </Container>
    );
};

export default PortKnockingApp;
