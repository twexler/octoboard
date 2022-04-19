import React from "react";
import type { NextPage } from "next";
import { Client, Config } from "../lib/octoprint/client";
import { ConnectMessage, CurrentMessage } from "../lib/octoprint/types";
import SettingsDialog from "../lib/components/SettingsDialog";
import OctoPrintStatus from "../lib/components/OctoPrintStatus";
import Temperatures from "../lib/components/Temperatures";
import { Col, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import PrintProgress from "../lib/components/PrintProgress";
import StreamViewer from "../lib/components/StreamViewer";

let client: Client;

const getClient = (config: Config): Client => {
  if (client === undefined) {
    client = new Client(config);
  }
  return client;
};

const Home: NextPage = () => {
  const [configMap, setConfigMap] = React.useState<any>({})
  const [octoPrintStatus, setOctoPrintStatus] = React.useState<
    ConnectMessage | undefined
  >(undefined)
  const [currentState, setCurrentState] = React.useState<
    CurrentMessage | undefined
  >(undefined)
  const [streamURL, setStreamURL] = React.useState<string>("")

  React.useEffect(() => {
    setConfigMap(
      localStorage.getItem("configMap")
        ? JSON.parse(localStorage.getItem("configMap")!)
        : {}
    );
  }, []);

  React.useEffect(() => {
    const config = new Config(configMap.baseURL, configMap.apiKey);
    if (!config.valid()) {
      console.log("invalid config");
    } else {
      const c = getClient(config);
      c.startSockJSClient();
      c.onConnectMesssage = (msg: ConnectMessage) => {
        setOctoPrintStatus(msg);
      };
      c.onCurrentMessage = (msg: CurrentMessage) => {
        setCurrentState(msg);
      };
     (async () => {
      const settings = await c.getSettings();
      setStreamURL(`${config.baseURL}${settings.webcam.streamUrl}`);
     })()
    }
  }, [configMap]);

  const isPrinting = currentState?.state.flags?.printing ?? false;

  return (
    <Layout style={{height: "100%"}}>
      <SettingsDialog setConfigMap={setConfigMap} />
      <Content style={{margin: "0 2em;", height: "100%"}}>
        <Row gutter={[6, 48]} style={{paddingBottom: "1em"}}>
          <Col span={6}>
            {octoPrintStatus && <OctoPrintStatus status={octoPrintStatus} />}
          </Col>
          {isPrinting && ( 
            <Col span={6}>
                <PrintProgress progress={currentState?.progress} />
            </Col>
          )}
        </Row>
        <Row style={{minHeight: 600}} gutter={[6, 48]}>
          <Col span={6} style={{maxHeight: 600}}>
            <StreamViewer streamURL={streamURL}/>
          </Col>
          <Col span={6}>
            {currentState && currentState.temps && (
              <Temperatures temps={currentState.temps} />
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
