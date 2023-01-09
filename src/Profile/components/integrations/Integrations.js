import React from 'react'
import AmazonSES from "./AmazonSES";
import {Card, Col, Row, Select} from "antd";

const Integrations = () => {
    const [integrationType, setIntegrationType] = React.useState(0);

    const handleChange = (event) => {
        event.preventDefault()
        
        const val = event.target.value;
        setIntegrationType(val)
    };
    
    return <>
        <Card>
            <Row gutter={[16,16]}>
                <Col span={1}>
                    <Select
                        defaultValue={integrationType}
                        style={{
                            width: 200,
                        }}
                        onChange={handleChange}>
                        <Select.Option key={0} value={0}>Amazon SES</Select.Option>
                    </Select>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={24}>
                    <AmazonSES />
                </Col>
            </Row>
        </Card>
    </>
}

export default Integrations