import net from 'net';
import { logWithTimestamp } from './logger';

interface Prop {
  serverAddress: string;
  tcpPort: number;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export const checkTcpPort = ({ serverAddress, tcpPort, setStatus }: Prop) => {
  const tcpClient = new net.Socket();
  const logger = logWithTimestamp(setStatus);

  tcpClient.setTimeout(3000); // Timeout in milliseconds
  tcpClient.on('connect', () => {
    logger(`TCP Port ${tcpPort} is open.`);
    tcpClient.end();
  });
  tcpClient.on('timeout', () => {
    logger(`TCP Port ${tcpPort} is closed or unreachable.`);
    tcpClient.destroy();
  });
  tcpClient.on('error', (error) => {
    logger(`Error while checking TCP Port ${tcpPort}:\n${error.message}`);
    tcpClient.destroy();
  });
  tcpClient.connect(tcpPort, serverAddress);
};
