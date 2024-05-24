import { TextField } from '@mui/material';
import { FC, Ref, createRef, useEffect } from 'react';

interface Prop {
  status: string;
  statusError: string;
}

export const StatusDisplay: FC<Prop> = ({ statusError, status }) => {
  const statusRef: Ref<HTMLInputElement | HTMLTextAreaElement> = createRef();

  useEffect(() => {
    if (statusRef.current) {
      const box = statusRef.current.getBoundingClientRect();

      statusRef.current.scrollTo({
        top: box.height,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [status]);

  return (
    <TextField
      label={'Status'}
      helperText={statusError ? 'Validation error' : ''}
      variant="outlined"
      fullWidth
      margin="normal"
      multiline
      value={statusError || status}
      error={Boolean(statusError)}
      rows={16}
      inputRef={statusRef}
      disabled
      InputProps={{
        style: { fontSize: '14px' },
      }}
    />
  );
};
