import React from "react";
import {convertToRaw} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {Col, Input, Row} from "antd";
import {Editor} from "react-draft-wysiwyg";
import {updateOnboarding} from "../../features/onboarding/onboardingSlice";
import {useDispatch, useSelector} from "react-redux";

const OnboardingSimpleTemplate = () => {
    const state = useSelector(x => x.onboarding)
    const dispatch = useDispatch()

    const onEditorStateChange = (passedState) => {        
        dispatch(updateOnboarding({
            ...state,
            simpleTemplate: {
                ...state.simpleTemplate,
                editorState: passedState,
                type: 0
            }
        }))
    }

    return <>
        <Row>
            <Col span={5}>
                <Input
                    onChange={(event) => {
                        dispatch(updateOnboarding({
                            ...state,
                            simpleTemplate: {
                                ...state.simpleTemplate,
                                name: event.target.value,
                                type: 0
                            }
                        }))
                    }}
                    value={state.simpleTemplate.name}
                    placeholder="Name" />
            </Col>
        </Row>
        <Row style={{marginTop: 10}}>
            <Col span={24}>
                <Editor
                    editorState={state.simpleTemplate.editorState}
                    editorStyle={{
                        backgroundColor: 'white',
                        height: 280,
                        padding: 5
                    }}
                    onEditorStateChange={onEditorStateChange}
                />
            </Col>
        </Row>
    </>
}

export default OnboardingSimpleTemplate;