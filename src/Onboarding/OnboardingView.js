import React, {useState} from 'react';
import {Button, Col, Result, Row, Steps} from "antd";
import OnboadingImportSubscriber from "./components/OnboadingImportSubscriber";
import OnboardingSimpleTemplate from "./components/OnboardingSimpleTemplate";
import OnboardingIntegrations from "./components/OnboardingIntegrations";
import {HeartOutlined} from "@ant-design/icons";
import draftToHtml from "draftjs-to-html";
import {convertToRaw} from "draft-js";
import {callApi} from "../utils/apiHelper";
import {useSelector} from "react-redux";
import {useAuth0} from "@auth0/auth0-react";
import history from "../utils/history";

const OnboardingView = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const onboardingState = useSelector(selector => selector.onboarding);
    const tagsState = useSelector(selector => selector.tags);
    const subscribersEndState = useSelector(x => x.importSubscribersTransformedData)
    const {getAccessTokenSilently} = useAuth0();
    
    const [buttonLoading, setButtonLoading] = useState(false)
    
    const constructImportSubscribers = () => {
        let subscribersListForSave = [];

        subscribersEndState.imported.forEach(importedSubscriber => {
            let obj = {
                extra: {}
            }
            for (let key in importedSubscriber){
                const modifiedFieldValue = subscribersEndState.modifiedFieldsValues[key];

                if (modifiedFieldValue){
                    if (modifiedFieldValue === 'email'){
                        obj['email'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'ipAddress'){
                        obj['ipAddress'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'firstName'){
                        obj['firstName'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'lastName'){
                        obj['lastName'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'phoneNumber'){
                        obj['phoneNumber'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'birthDate'){
                        obj['birthDate'] = importedSubscriber[key];
                    }

                    if (modifiedFieldValue === 'tags'){
                        console.log(importedSubscriber[key])
                        const splited = importedSubscriber[key].split(',')
                        const checked = splited[0] === '' ? [] : splited;

                        obj['tags'] = checked;
                    }

                    if (modifiedFieldValue === 'leaveAsIs'){
                        obj.extra[key] = importedSubscriber[key];
                    }
                }
            }

            subscribersListForSave.push({
                ...obj,
                extra: JSON.stringify(obj.extra)
            })
        })
        
        return {
            areSubscribers: onboardingState.importSubscribers.areSubscribers,
            subscribers: subscribersListForSave,
            tags: tagsState
        }
    }
    
    const constructSimpleTemplate = () => {
        const simpleTemplate = onboardingState.simpleTemplate;
        
        if (!simpleTemplate.name || simpleTemplate.name.length <= 0){
            return null;
        }

        const html = draftToHtml(convertToRaw(simpleTemplate.editorState.getCurrentContent()));
        const baseHtml = `
            <!DOCTYPE html>
            <html>
                <body>
                    <div>
                        {HTML_CONTENT_HERE}
                    </div>
                    <div style="text-align: center">
                        <span>No longer interested?</span><a id="unsubscribe" href="{{BASE_ADDRESS}}/subscribers/unsubscribe?email={{SUBSCRIBER_EMAIL}}&subscriberId={{SUBSCRIBER_ID}}&returnUrl=https://mailgen.org/unsubscribe/">Unsubscribe</a>
                    </div>
                    <div id="platform-advertisement" style="text-align: center;margin-top:25px;">
                        <a style="display: inline-block;vertical-align: middle;line-height: normal;text-decoration: none;color: inherit;" href="https://mailgen.org" target="_blank">
                            <img style="display: inline-block;vertical-align: middle;line-height: normal;" alt="mailgen" height="80" width="150" src={process.env.PUBLIC_URL + '/PoweredByMailgen.png'} />
                        </a>
                    </div>
                </body>
            </html>`;
        
        return {
            name: simpleTemplate.name,
            html: html,
            baseHtml: baseHtml,
            type: 0
        }
    }
    
    const constructIntegration = () => {
        const integration = onboardingState.amazonSesIntegration;
        
        if (!integration.publicKey ||
            integration.publicKey.length <= 0 ||
            !integration.privateKey ||
            integration.privateKey.length <= 0){
            return null;
        }
        
        return {
            region: integration.region,
            publicKey: integration.publicKey,
            privateKey: integration.privateKey
        }
    }
    
    const next = async () => {
        if (currentStep < 3){
            setCurrentStep(currentStep + 1);   
        }
        else{
            setButtonLoading(true)
            
            const importSubscribers = constructImportSubscribers();
            const simpleTemplate = constructSimpleTemplate();
            // const integration = constructIntegration()
            
            await callApi(getAccessTokenSilently, {
                url: `${process.env.REACT_APP_API_BASE}/onboarding/setup`,
                method: 'post',
                request: {
                    subscribers: importSubscribers,
                    emailTemplate: simpleTemplate,
                    // amazonSesIntegration: integration
                },
                successCallback: () => {
                    setButtonLoading(false)
                    history.go(0)
                },
                errorCallback: () => { }
            })
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };
    
    const renderStep = () => {
        if (currentStep === 0){
            return <>
                <Result
                    icon={<HeartOutlined />}
                    title="Welcome!"
                    subTitle="We're very happy to see you here. Let's first setup your Account. Of course all steps are optional. You can complete them whenever you want!"
                />
            </>;
        }
        
        if (currentStep === 1){
            return <OnboadingImportSubscriber />;
        }

        if (currentStep === 2){
            return <OnboardingSimpleTemplate />;
        }
        
        // if (currentStep === 3){
        //     return <OnboardingIntegrations />;
        // }
        if (currentStep === 3){
            return <Result
                status="success"
                title="All set!"
                subTitle="You can now start sending emails"
            />;
        }
    }
    
    return <>
        <div style={{marginTop: '30px', marginLeft: '30px'}}>
            <Row style={{height: '100%'}}>
                <Col span={6}>
                    <Steps direction="vertical" current={currentStep}>
                        <Steps.Step title="Welcome" />
                        <Steps.Step title="Import Subscribers (optional)" description="Migrate your subscribers to Mailgen" />
                        <Steps.Step title="Create a simple template (optional)" description="Create your first email template" />
                        {/*<Steps.Step title="Connect Amazon SES (optional)" description="Connect you Amazon SES account" />*/}
                        <Steps.Step title="Finish" description="Complete your setup." />
                    </Steps>
                </Col>
                <Col span={16}>
                    <Row>
                        <Col span={24}>
                            {renderStep()}
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={12}>
                            <Button onClick={prev} shape="round">Back</Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                loading={buttonLoading}
                                onClick={next} 
                                shape="round" 
                                type='primary' 
                                style={{float: 'right'}}>{currentStep  === 3 ? "Complete" : "Next / Skip"}</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    </>
}

export default OnboardingView;