import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import { StatusDisplay } from './StatusDisplay';
import { FormFields } from './FormFields';
import { ConfigManager } from './ConfigManager';
import { FormData, useFormReducer } from '../hooks';
import { sendKnock } from '../utils';

export const PortKnockingApp: FC = () => {
  const [status, setStatus] = useState<string>('');
  const [statusError, setStatusError] = useState<string>('');
  const [state, dispatch, validateForm] = useFormReducer();
  const { errors, formData } = state;
  const { serverAddress, udpPorts, interval, tcpPort } = formData;

  useEffect(() => {
    handleError();
  }, [state.errors]);

  const handleError = () => {
    const message = Object.keys(errors)
      .map((key: keyof FormData) => errors[key])
      .join('\n');

    setStatusError(message);
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch({
      type: 'SET_FIELD',
      field: name as keyof FormData,
      value,
    });
  };

  // Handle knock button press
  const handleStart = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      sendKnock({ serverAddress, udpPorts, interval, tcpPort, setStatus });
    } else {
      handleError();
    }
  };

  // Load a configuration into the form
  const handleConfigLoad = (config: FormData) => {
    dispatch({ type: 'LOAD_CONFIG', config });
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
      <Grid
        item
        xs={12}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <ConfigManager
          formData={formData}
          onConfigLoad={handleConfigLoad}
          validateForm={validateForm}
          handleError={handleError}
        />
      </Grid>
      <Grid item xs={6}>
        <FormFields
          handleChange={handleChange}
          handleStart={handleStart}
          formData={formData}
        />
      </Grid>
      <Grid item xs={6}>
        <StatusDisplay status={status} statusError={statusError} />
      </Grid>
    </Grid>
  );
};
