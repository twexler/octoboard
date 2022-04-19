import { Card } from "antd";

type StreamViewerProps = {
    streamURL: string;
}

const StreamViewer: React.FC<StreamViewerProps> = ({ streamURL }) => {
    return (
        <Card style={{maxWidth: 500}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={streamURL}
                width="100%"
                height="100%"
                alt="Printer webcam stream"
            /> 
        </Card>
    );
}

export default StreamViewer