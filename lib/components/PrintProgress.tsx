import { ClockCircleTwoTone } from "@ant-design/icons"
import { Card, Col, Progress, Row } from "antd"
import dayjs from "dayjs"
import RelativeTime from "dayjs/plugin/relativeTime"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import { Progress as OctoPrintProgress } from "../octoprint/types"

type PrintProgressProps = {
    progress?: OctoPrintProgress
}
const PrintProgress: React.FC<PrintProgressProps> = ({ progress }) => {
    dayjs.extend(RelativeTime)
    dayjs.extend(LocalizedFormat)
    return (
        <Card title="Print Progress">
            <Progress
                percent={progress!.completion}
                status="active"
                format={(percent) => `${percent?.toPrecision(3)}%`}
            />
            <>
                <Row>
                    <Col span={7}>
                            <ClockCircleTwoTone style={{paddingRight: "0.5em"}}/>
                            {dayjs().add(progress!.printTimeLeft, 'second').fromNow()}
                    </Col>
                    <Col offset={12} span={4} push={2}>
                        {dayjs().add(progress!.printTimeLeft, 'second').format("LT")}
                    </Col>
                </Row>

            </>
        </Card>
    )
}

export default PrintProgress