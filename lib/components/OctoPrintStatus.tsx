import { Card } from "antd";
import { ConnectMessage } from "../octoprint/types";

type OctoPrintStatusProps = {
  status: ConnectMessage;
};

const OctoPrintStatus: React.FC<OctoPrintStatusProps> = ({ status }) => {
  return (
    <Card title="OctoPrint Status">
      <ul>
        <li>Version: {status.version}</li>
        <li>Python Version: {status.python_version}</li>
      </ul>
    </Card>
  );
};

export default OctoPrintStatus;
