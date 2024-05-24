const getCurrentTimestamp = () => {
  const now = new Date();

  return now.toLocaleTimeString('hu-HU');
};

export const logWithTimestamp = (
  setState: React.Dispatch<React.SetStateAction<string>>,
) => {
  return (message: string) => {
    const timestampedMessage = `[${getCurrentTimestamp()}] ${message}`;

    setState((prevStatus) => prevStatus + timestampedMessage + '\n');
  };
};
