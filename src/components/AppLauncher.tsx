import React, { useState, useEffect } from 'react';
import { shell } from 'electron';
import { IconButton, Tooltip } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { dialog } from '@electron/remote';

const AppLauncherButton: React.FC = () => {
  const [appPath, setAppPath] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the stored app path on component mount
    const storedPath = localStorage.getItem('appPath');
    if (storedPath) {
      setAppPath(storedPath);
    }
  }, []);

  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (event.shiftKey || !appPath) {
      // Open the dialog to select an app
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          {
            name: 'Applications',
            extensions:
              process.platform === 'win32'
                ? ['exe']
                : process.platform === 'darwin'
                  ? ['app']
                  : ['sh'],
          },
        ],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0];
        setAppPath(selectedPath);
        localStorage.setItem('appPath', selectedPath);
      }
    } else {
      // Launch the stored application
      if (appPath) {
        shell.openPath(appPath);
      }
    }
  };

  return (
    <Tooltip
      title={
        <>
          CLICK: Launch App
          <br />
          SHIFT + CLICK: Browse App
        </>
      }
      placement="top"
    >
      <IconButton color="secondary" onClick={handleButtonClick}>
        <RocketLaunchIcon />
      </IconButton>
    </Tooltip>
  );
};

export default AppLauncherButton;
