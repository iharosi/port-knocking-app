import React, { useState, useCallback, Ref, createRef, useEffect } from 'react';
import dgram from 'dgram';
import net from 'net';
import { TextField, Button, Typography, Grid } from '@mui/material';

// Constants
const DEFAULT_SERVER_ADDRESS = '127.0.0.1';
const DEFAULT_PORTS = '1001,1002,1003,1004';
const DEFAULT_INTERVAL = 1000; // Default interval in milliseconds
const DEFAULT_PORT_TO_CHECK = 8080;

const PortKnockingApp: React.FC = () => {
  const [serverAddress, setServerAddress] = useState<string>(
    DEFAULT_SERVER_ADDRESS,
  );
  const [ports, setPorts] = useState<string>(DEFAULT_PORTS);
  const [checkInterval, setCheckInterval] = useState<number>(DEFAULT_INTERVAL);
  const [portToCheck, setPortToCheck] = useState<number>(DEFAULT_PORT_TO_CHECK);
  const [status, setStatus] = useState<string>(' ');
  const statusRef: Ref<HTMLInputElement | HTMLTextAreaElement> = createRef();

  useEffect(() => {
    const box = statusRef.current.getBoundingClientRect();
    statusRef.current.scrollTo({
      top: box.height,
      left: 0,
      behavior: 'smooth',
    });
  }, [status]);

  const updateState = useCallback(
    (type: 'interval' | 'portToCheck', value: string) => {
      const defaultValue =
        type === 'interval' ? DEFAULT_INTERVAL : DEFAULT_PORT_TO_CHECK;
      const parsedValue = parseInt(value, 10);
      const newValue = !Number.isNaN(parsedValue) ? parsedValue : defaultValue;

      if (type === 'interval') {
        setCheckInterval(newValue);
      } else {
        setPortToCheck(newValue);
      }
    },
    [],
  );

  const getCurrentTimestamp = () => {
    const now = new Date();

    return now.toLocaleTimeString('hu-HU');
  };

  const logStatus = (message: string) => {
    const timestampedMessage = `[${getCurrentTimestamp()}] ${message}`;
    setStatus((prevStatus) => prevStatus + timestampedMessage + '\n');
  };

  const checkTcpPort = () => {
    const tcpClient = new net.Socket();

    tcpClient.setTimeout(3000); // Timeout in milliseconds
    tcpClient.on('connect', () => {
      logStatus(`TCP Port ${portToCheck} is open.`);
      tcpClient.end();
    });
    tcpClient.on('timeout', () => {
      logStatus(`TCP Port ${portToCheck} is closed or unreachable.`);
      tcpClient.destroy();
    });
    tcpClient.on('error', (error) => {
      logStatus(
        `Error while checking TCP Port ${portToCheck}: ${error.message}`,
      );
      tcpClient.destroy();
    });
    tcpClient.connect(portToCheck, serverAddress);
  };

  const sendKnock = () => {
    const portList = ports.split(',').map((port) => parseInt(port.trim(), 10));
    const knockPorts = (index: number) => {
      if (index >= portList.length) {
        logStatus('Port knocking sequence completed.');
        checkTcpPort();
        return;
      }

      const client = dgram.createSocket('udp4');

      client.on('error', (error) => {
        logStatus(
          `Error knocking on port ${portList[index]}: ${error.message}`,
        );
      });
      client.send('', portList[index], serverAddress, (error) => {
        if (!error) {
          logStatus(`Knocked on port ${portList[index]}`);
        }
        client.close();
        setTimeout(() => knockPorts(index + 1), checkInterval); // Delay before the next knock
      });
    };

    setStatus('Port knocking in progress...\n');
    knockPorts(0);
  };

  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={12}>
        <Typography
          align="center"
          variant="h4"
          style={{ marginBottom: '2rem' }}
        >
          Port Knocking App
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Server Address (IP or domain without protocol)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={serverAddress}
          placeholder={DEFAULT_SERVER_ADDRESS}
          onChange={(e) => setServerAddress(e.target.value)}
        />
        <TextField
          label="Comma-separated ports (UDP)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ports}
          placeholder={DEFAULT_PORTS}
          onChange={(e) => setPorts(e.target.value)}
        />
        <TextField
          label="Interval (milliseconds)"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={checkInterval}
          onChange={(e) => {
            updateState('interval', e.target.value);
          }}
        />
        <TextField
          label="Port to check after the knocks (TCP)"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={portToCheck}
          onChange={(e) => {
            updateState('portToCheck', e.target.value);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={sendKnock}
          style={{ marginTop: '12px' }}
        >
          Knock
        </Button>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Status"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          value={status}
          rows={16}
          inputRef={statusRef}
          disabled
          InputProps={{
            style: { fontSize: '14px' },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PortKnockingApp;
