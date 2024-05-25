import { FC, useEffect, useState } from 'react';
import {
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FormData } from '../hooks';

interface ConfigManagerProps {
  formData: FormData;
  onConfigLoad: (config: FormData) => void;
  validateForm: () => boolean;
  handleError: () => void;
}

export const ConfigManager: FC<ConfigManagerProps> = ({
  formData,
  onConfigLoad,
  validateForm,
  handleError,
}) => {
  const [savedConfigs, setSavedConfigs] = useState<{ [key: string]: FormData }>(
    {},
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string>('');

  useEffect(() => {
    loadSavedConfigs();
  }, []);

  // Save the current configuration
  const saveConfig = () => {
    if (validateForm()) {
      const configs = { ...savedConfigs, [formData.serverAddress]: formData };
      localStorage.setItem('portKnockerConfigs', JSON.stringify(configs));
      setSavedConfigs(configs);
      setSelectedConfig(formData.serverAddress);
    } else {
      handleError();
    }
  };

  // Load saved configurations from localStorage
  const loadSavedConfigs = () => {
    const configs = JSON.parse(
      localStorage.getItem('portKnockerConfigs') || '{}',
    );
    setSavedConfigs(configs);
  };

  // Load a configuration by server address
  const loadConfig = (address: string) => {
    const config = savedConfigs[address];
    if (config) {
      onConfigLoad(config);
    }
  };

  // Handle delete confirmation dialog
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfig = () => {
    if (selectedConfig) {
      const configs = { ...savedConfigs };
      delete configs[selectedConfig];
      setSavedConfigs(configs);
      localStorage.setItem('portKnockerConfigs', JSON.stringify(configs));
      setDeleteDialogOpen(false);
      setSelectedConfig('');
    }
  };

  return (
    <>
      <TextField
        select
        fullWidth
        label="Preset"
        value={selectedConfig}
        onChange={(e) => {
          setSelectedConfig(e.target.value as string);
          loadConfig(e.target.value as string);
        }}
        style={{ marginRight: '8px' }}
      >
        <MenuItem value="" disabled>
          Load Saved Configuration
        </MenuItem>
        {Object.keys(savedConfigs).map((address) => (
          <MenuItem key={address} value={address}>
            {address}
          </MenuItem>
        ))}
      </TextField>
      <IconButton color="primary" onClick={saveConfig}>
        <SaveIcon />
      </IconButton>
      <IconButton
        color="secondary"
        onClick={handleDeleteDialogOpen}
        disabled={!selectedConfig}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the configuration for{' '}
            {selectedConfig}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfig} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
