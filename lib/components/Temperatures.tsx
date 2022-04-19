import { DeviceThermostat } from "@mui/icons-material";
import { Card, Col, Progress, Row } from "antd";
import React from "react";
import { Temperature, TemperatureData } from "../octoprint/types";

type TemperatureProps = {
  temps: Array<Temperature>;
};

type TemperatureLabelProps = {
  label: string
  value?: number
}

const TemperatureLabel: React.FC<TemperatureLabelProps> = ({value, label}) => {
  return (
    <p style={{fontSize: "large"}}>
      <DeviceThermostat/>
      <br/>
      {value}°C
      <br/>
      {label}
    </p>
  )
}

const Temperatures: React.FC<TemperatureProps> = ({ temps }) => {
  const [bedTemp, setBedTemp] = React.useState<TemperatureData>({} as TemperatureData);
  const [toolTemps, setToolTemps] = React.useState<Array<TemperatureData>>([]);


  function typedKeys<T>(o: T): (keyof T)[] {
    // type cast should be safe because that's what really Object.keys() does
    return Object.keys(o) as (keyof T)[];
  }

  const parseTool: (tool: string) => number = (tool) => {
    const idString = tool.split("tool")[1];
    return parseInt(idString, 10);
  }


  React.useEffect(() => {
    if (temps.length > 0) {
      const tempNow = temps[0]
      if (tempNow.bed) {
        setBedTemp(tempNow.bed);
      }
      typedKeys(tempNow).forEach((key) => {
        if (key !== "bed") {
          const temp = tempNow[key] as TemperatureData;
          if (temp.actual) {
            const id = parseTool(key.toString());
            setToolTemps((prev) => {
              const newToolTemps = [...prev];
              newToolTemps[id] = temp;
              return newToolTemps;
            });
          }
        }
      })
    }
  }, [temps]);
  

  return (
    <Card title="Temperatures" style={{maxWidth: 600}}>
      <Row gutter={16}>
        <Col key={0} span={10}>
          <Progress
            type="dashboard"
            percent={bedTemp.actual}
            strokeColor={bedTemp.actual < bedTemp.target ? "red" : "green"}
            format={(percent) => <TemperatureLabel value={percent} label="Bed" />}
          />
        </Col>
        {toolTemps.map((temp, i) => (
          <Col key={i+1} span={12}>
            <Progress
              type="dashboard"
              percent={temp.actual/3.5} // maximum is 350°C, but we want to show 0-100%
              strokeColor = {temp.actual < temp.target ? "red" : "green"}
              format={(percent) => <TemperatureLabel value={percent!*3.5} label={`Tool #${i+1}`} />}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
};
export default Temperatures;

