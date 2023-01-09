import React, {useEffect, useState} from 'react'
import DateRange from "./DateRange";
import {Col, DatePicker, Row, Select} from "antd";
import {Option} from "antd/es/mentions";

const RangeTypes = [{
    id: 0,
    name: 'Last 30 Days',
    transform: () => {
        let fromDate = new Date()
        fromDate.setDate(fromDate.getDate() - 30)

        return new DateRange(fromDate, new Date())
    }
}, {
    id: 1,
    name: 'Last 7 Days',
    transform: () => {
        let fromDate = new Date()
        fromDate.setDate(fromDate.getDate() - 7)

        return new DateRange(fromDate, new Date())
    }
}, {
    id: 2,
    name: 'Last Month',
    transform: () => {
        const date = new Date();
        const firstDayLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const firstDayCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(firstDayCurrentMonth.getFullYear(), firstDayCurrentMonth.getMonth(), firstDayCurrentMonth.getDate() - 1);
        return new DateRange(firstDayLastMonth, lastDay)
    }
}, {
    id: 3,
    name: 'Custom',
    transform: () => {
        let fromDate = new Date()
        fromDate.setDate(fromDate.getDate() - 30)

        return new DateRange(fromDate, new Date())
    }
}]

const DateRangePicker = (props) => {
    const {
        value,
        handler
    } = props

    const [selectedRangeType, setSelectedRangeType] = useState(0)
    const [customDateRangeDisabled, setCustomDateRangeDisabled] = useState(true)

    const onRangeTypeChange = (value) => {
        setSelectedRangeType(value)

        if (value === 3) {
            setCustomDateRangeDisabled(false)
        } else {
            setCustomDateRangeDisabled(true)
        }

        const range = RangeTypes.filter(x => x.id === value)[0].transform()
        const rangeValid = range.validate()
        handler({
            range: {
                from: range.From,
                to: range.To
            },
            valid: rangeValid
        })
    }

    const onFromDateChanged = (momentVal, dateStr) => {
        const isValid = new DateRange(dateStr, value.range.to).validate()
        handler({
            range: {
                ...value.range,
                from: dateStr
            },
            valid: isValid
        });
    }
    
    const onToDateChanged = (momentVal, dateStr) => {
        const isValid = new DateRange(value.range.from, dateStr).validate()
        handler({
            range: {
                ...value.range,
                to: dateStr
            },
            valid: isValid
        });
    }

    useEffect(() => onRangeTypeChange(selectedRangeType), [])

    return <>
        <Row justify="start" gutter={[16, 42]}>
            <Col>
                <Select
                    defaultValue={0}
                    style={{
                        width: 120,
                    }}
                    onChange={onRangeTypeChange}
                >
                    <Option value={0}>Last 30 Days</Option>
                    <Option value={1}>Last 7 Days</Option>
                    <Option value={2}>Last Month</Option>
                    <Option value={3}>Custom</Option>
                </Select>
            </Col>
            <Col span={8}>
                <DatePicker
                    placeholder="From"
                    onChange={onFromDateChanged}
                    defaultValue={value.range.from}    
                    disabled={customDateRangeDisabled} 
                    placement={'bottomLeft'} />
            </Col>
            <Col span={8}>
                <DatePicker
                    placeholder="To"
                    onChange={onToDateChanged}
                    defaultValue={value.range.to}    
                    disabled={customDateRangeDisabled} 
                    placement={'bottomLeft'} />
            </Col>
        </Row>
    </>
}

export default DateRangePicker