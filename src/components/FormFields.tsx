import { ChangeEvent, FC, FormEvent } from 'react';
import { TextField, Button } from '@mui/material';
import { FormData } from '../hooks';
import {
  DEFAULT_SERVER_ADDRESS,
  DEFAULT_UDP_PORTS,
  DEFAULT_INTERVAL,
  DEFAULT_TCP_PORT,
} from '../utils';

interface Prop {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleStart: (e: FormEvent) => void;
  formData: FormData;
}

export const FormFields: FC<Prop> = ({
  handleChange,
  handleStart,
  formData,
}) => {
  const { serverAddress, udpPorts, interval, tcpPort } = formData;

  return (
    <>
      <TextField
        name="serverAddress"
        label="Server Address (IP or domain without protocol)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={serverAddress}
        placeholder={DEFAULT_SERVER_ADDRESS}
        onChange={handleChange}
      />
      <TextField
        name="udpPorts"
        label="Comma-separated ports (UDP)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={udpPorts}
        placeholder={DEFAULT_UDP_PORTS}
        onChange={handleChange}
      />
      <TextField
        name="interval"
        label="Interval (milliseconds)"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        placeholder={DEFAULT_INTERVAL.toString()}
        value={interval}
        onChange={handleChange}
      />
      <TextField
        name="tcpPort"
        label="Port to check after the knocks (TCP)"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        placeholder={DEFAULT_TCP_PORT.toString()}
        value={tcpPort}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleStart}
        style={{ marginTop: '12px' }}
      >
        Knock
      </Button>
    </>
  );
};
