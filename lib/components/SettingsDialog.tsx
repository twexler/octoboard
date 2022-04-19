import { SettingOutlined } from "@ant-design/icons";
import { Button, Col, Input, Modal, Row } from "antd";
import React from "react";
import { Config } from "../octoprint/client";

type SettingsDialogProps = {
  setConfigMap: (configMap: any) => void;
};

const SettingsDialog: React.FunctionComponent<SettingsDialogProps> = ({
  setConfigMap,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  // probably doesn't need to be state, yolo
  const [baseURL, setBaseURL] = React.useState("");
  const [apiKey, setAPIKey] = React.useState("");

  const handleOpen = () => {
    const cfg = localStorage.getItem("configMap")
      ? JSON.parse(localStorage.getItem("configMap")!)
      : {};
    if (cfg !== {}) {
      setBaseURL(cfg.baseURL);
      setAPIKey(cfg.apiKey);
    }
    setOpen(true);
  };

  const handleSave = () => {
    const cfg = new Config(baseURL, apiKey);
    if (cfg.valid()) {
      localStorage.setItem("configMap", JSON.stringify({ baseURL, apiKey }));
      setConfigMap({ baseURL, apiKey });
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} color="primary" icon={<SettingOutlined/>}>
        Settings
      </Button>
      <Modal 
        title="Settings"
        visible={open}
        onOk={handleSave}
        onCancel={() => setOpen(false)}
      >
          <Row gutter={16}>
            <Col span={8}>
              <Input
                id="baseURL"
                value={baseURL}
                placeholder="OctoPrint URL"
                onChange={(e) => setBaseURL(e.target.value)}
              />
            </Col>
            <Col span={16}>
              <Input
                id="apiKey"
                value={apiKey}
                placeholder="OctoPrint Application Key"
                onChange={(e) => setAPIKey(e.target.value)}
              />
            </Col>
          </Row>
      </Modal>
    </>
  );
};

export default SettingsDialog;
