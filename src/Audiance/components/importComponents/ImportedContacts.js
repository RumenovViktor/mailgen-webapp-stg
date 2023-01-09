import {Table} from "antd";
import {getImportedContactsColumns} from "../../logic/columns";
import {ContainerWrapper} from "../../../reportComponents/CampaignStyles";
import * as React from "react";
import {useEffect, useState} from "react";
import validateEmail from "../../../utils/ValueValidations";
import {
    updateImportedAudienceData,
    updateImportSubscribersTransformedData
} from "../../../features/ImportSubscribers/importSubscribersTransformedDataSlice";
import {useDispatch, useSelector} from "react-redux";

const ImportedContacts = ({loading, importedSubscribers}) => {
    const dispatch = useDispatch();
    const state = useSelector(x => x.importSubscribersTransformedData)
    
    const [columns, setColumns] = useState([]);
    const [localReportData, setLocalReportData] = useState([]);
    const [fieldsTransformations, setFieldsTransformations] = useState({
        email: null
    })
    
    const setupEmailAddress = (subscribers) => {
        let emailAddressFieldName = null;
        const propertyNames = Object.keys(subscribers[0]);
        
        subscribers.forEach(subscriber => {
            if (emailAddressFieldName !== null){
                return;
            }
            
            propertyNames.forEach(propertyName => {
                if (emailAddressFieldName !== null){
                    return;
                }
                
                debugger
                const val = !subscriber[propertyName] ? '' : subscriber[propertyName];
                if (validateEmail(val)){
                    emailAddressFieldName = propertyName;
                }
            })
        })
        
        return emailAddressFieldName;
    }
    
    const setupColumns = () => {
        const staticColumns = getImportedContactsColumns();
        let newColumns = [];
        let templateState = {}
        
        if (!localReportData[0]){
            return;
        }
        
        Object.keys(localReportData[0]).forEach(x => {
            if (x === 'email' && fieldsTransformations.email){
                templateState[x] = 'email';
                newColumns.push(staticColumns.email(fieldsTransformations.email))
            }
            
            else{
                const partOfStaticFields = Object.keys(fieldsTransformations).includes(x)
                
                if (!partOfStaticFields){
                    templateState[x] = 'ignoreField';
                    newColumns.push(staticColumns.getGeneric(x))
                }
            }
            
        })
        
        debugger
        dispatch(updateImportSubscribersTransformedData({
            ...state,
            modifiedFieldsValues: {
                ...state.modifiedFieldsValues,
                ...templateState
            }
        }))
        
        setColumns([...newColumns])
    }
    
    useEffect(() => {
        let fields = {
            email: null
        };
        
        if(importedSubscribers.length <= 0){
            setLocalReportData([])
            setColumns([])
        }
        
        if (importedSubscribers.length > 0){
            fields.email = setupEmailAddress(importedSubscribers)
            
            const result = importedSubscribers.map(x => {
                let obj = {}
                let usedFields = [];
                
                Object.entries(fields).map(transformationArray => {
                    const originalKey = transformationArray[0];
                    const transformedKey = transformationArray[1];
                    
                    obj[originalKey] = x[transformedKey];
                    usedFields.push(transformedKey)
                })
                
                Object.entries(x).map(importedSubscriber => {
                    if (!usedFields.includes(importedSubscriber[0])){
                        obj[importedSubscriber[0]] = importedSubscriber[1]
                    }                    
                })
                
                return obj;
            })
            
            setLocalReportData(result)
            dispatch(updateImportedAudienceData(result))
        }
        
        setFieldsTransformations(fields)
        setupColumns()
    }, [importedSubscribers])
    
    return <>
        <ContainerWrapper>
            <Table
                loading={loading}
                columns={columns}
                scroll={{
                    x: true,
                }}
                dataSource={localReportData.map((x, index) => {
                    return {
                        ...x,
                        key: `${index}-index`
                    }
                })}
            />
        </ContainerWrapper>
    </>
}

export default ImportedContacts;