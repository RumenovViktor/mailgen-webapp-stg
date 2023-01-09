import {Select} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    updateSingleTransformedField
} from "../../../features/ImportSubscribers/importSubscribersTransformedDataSlice";

const FieldTypesSelect = ({defaultSelected, disabled, currentKey}) => {
    const dispatch = useDispatch();
    const state = useSelector(x => x.importSubscribersTransformedData)
    const [usedFields, setUsedFields] = useState([])
    
    const onChange = (val) => {
        dispatch(updateSingleTransformedField({
            key: currentKey,
            value: val
        }))
    }
    
    useEffect(() => {
        const usedValues = Object.entries(state.modifiedFieldsValues).map(x => {
            return x[1]
        })
        
        setUsedFields(usedValues)
    }, [state.modifiedFieldsValues])
    
    return <>
        <Select
            onChange={onChange}    
            disabled={disabled} 
            defaultValue={defaultSelected} 
            style={{ width: '25vh' }}>
            <Select.OptGroup label={"Custom Fields"}>
                <Select.Option value="ignoreField">Ignore Field</Select.Option>
                <Select.Option value="leaveAsIs">Leave As Is</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label={"Existing Fields"}>
                <Select.Option disabled={usedFields.includes('email')} value="email">Email</Select.Option>
                <Select.Option disabled={usedFields.includes('ipAddress')} value="ipAddress">IP Address</Select.Option>
                <Select.Option disabled={usedFields.includes('firstName')} value="firstName">First Name</Select.Option>
                <Select.Option disabled={usedFields.includes('lastName')} value="lastName">Last Name</Select.Option>
                <Select.Option disabled={usedFields.includes('phoneNumber')} value="phoneNumber">Phone Number</Select.Option>
                <Select.Option disabled={usedFields.includes('birthDate')} value="birthDate">Birth Date</Select.Option>
                <Select.Option disabled={usedFields.includes('tags')} value="tags">Tags</Select.Option>
            </Select.OptGroup>
        </Select>
    </>
}

export default FieldTypesSelect;