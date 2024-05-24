import dgram from 'dgram';
import { checkTcpPort } from './checkTcpPort';
import { logWithTimestamp } from './logger';

interface Prop {
  serverAddress: string;
  udpPorts: string;
  interval: number;
  tcpPort: number;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export const sendKnock = ({
  serverAddress,
  udpPorts,
  interval,
  tcpPort,
  setStatus,
}: Prop) => {
  const logger = logWithTimestamp(setStatus);
  const portList = udpPorts.split(',').map((port) => parseInt(port.trim(), 10));
  const knockPorts = (index: number) => {
    if (index >= portList.length) {
      logger('Port knocking sequence completed.');
      checkTcpPort({
        serverAddress,
        tcpPort,
        setStatus,
      });
      return;
    }

    const client = dgram.createSocket('udp4');

    client.on('error', (error) => {
      logger(`Error knocking on port ${portList[index]}: ${error.message}`);
    });
    client.send('', portList[index], serverAddress, (error) => {
      if (!error) {
        logger(`Knocked on port ${portList[index]}`);
      }
      client.close();
      setTimeout(() => knockPorts(index + 1), interval); // Delay before the next knock
    });
  };

  logger('Port knocking in progress...');
  knockPorts(0);
};
