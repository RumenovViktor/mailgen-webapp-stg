import React, {useRef, useState} from 'react';
import {IconButton, TextField} from '@material-ui/core';
import useStyles from '../EmailTemplate/styles';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import queryString from 'query-string';
import LoadingButton from '../components/LoadingButton';
import {getConfig} from "../config";
import {useAuth0} from "@auth0/auth0-react";
import {Alert, AlertTitle, Collapse, Grid} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EmailBuilder from "../EmailBuilder/EmailBuilder";

const EmailTemplate = (props) => {
    const styles = useStyles()
    const emailEditorRef = useRef(null);
    const query = queryString.parse(props.location.search)
    const config = getConfig()

    const [name, setName] = useState('')
    const [saveInProgress, setSaveInProgress] = useState(false)
    const [errorOnUpsert, setErrorOnUpsert] = useState({open: false, message: ''})
    const [fieldsErrorState, setFieldsErrorState] = useState({
        name: false
    })
    const {getAccessTokenSilently} = useAuth0();

    const execute = async (data) => {
        setSaveInProgress(true)

        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user",
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                id: query.id,
                name: name,
                html: data.html,
                json: JSON.stringify(data.json)
            })
        }

        fetch(`${process.env.REACT_APP_API_BASE}/emailTemplates/upsertTemplate`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setSaveInProgress(false)
                if (!data.isSuccess) {
                    setErrorOnUpsert({open: true, message: data.message});
                }
            })
            .catch(err => console.log(err))
    }

    const save = () => {
        if (!name || name === '') {
            setFieldsErrorState({
                name: true
            })
            return
        }

        setFieldsErrorState({
            name: false
        })

        emailEditorRef.current.editor.exportHtml(data => {
            const {design, html} = data;
            execute({
                html: html,
                json: design
            })
        })
    };

    const onLoad = async () => {
        if (query.mode === 'update') {
            const accessToken = await getAccessTokenSilently({
                audience: config.audience,
                scope: "read:current_user",
            });

            fetch(`${process.env.REACT_APP_API_BASE}/emailTemplates/getById?id=${query.id}`, {
                headers: {Authorization: `Bearer ${accessToken}`},
            })
                .then(x => x.json())
                .then(response => {
                    setName(response.template.name)
                    emailEditorRef.current.editor.loadDesign(JSON.parse(response.template.json))
                })
        }
    };

    return <>
        <div className={styles.main}>
            <Grid container>
                <Grid item xs={12}>
                    <Collapse in={errorOnUpsert.open}>
                        <Alert
                            severity="error"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setErrorOnUpsert({open: false, message: ''});
                                    }}
                                >
                                    <CloseIcon fontSize="inherit"/>
                                </IconButton>
                            }
                            sx={{mb: 2}}
                        >
                            <AlertTitle>Validation Error</AlertTitle>
                            {errorOnUpsert.message}
                        </Alert>
                    </Collapse>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={10}>
                    <div>
                        <TextField
                            error={fieldsErrorState.name}
                            helperText={fieldsErrorState.name ? 'Name field is required!' : ''}
                            label="Name"
                            value={name}
                            onChange={(x) => setName(x.target.value)}
                            className={styles.name}
                        />
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <LoadingButton
                        loading={saveInProgress}
                        onClick={save}
                        className={styles.save}
                        startIcon={saveInProgress ? '' : <SaveOutlinedIcon/>}
                        text="Save"/>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <EmailBuilder />
                    {/*<EmailEditor*/}
                    {/*    style={{marginTop: 5, minHeight: 800}}*/}
                    {/*    ref={emailEditorRef}*/}
                    {/*    onLoad={onLoad}*/}
                    {/*    projectId={1071}*/}
                    {/*    options={{*/}
                    {/*        customJS: [*/}
                    {/*            window.location.protocol + '//' + window.location.host + '/banCustomTool.js',*/}
                    {/*            window.location.protocol + '//' + window.location.host + '/blogCustomTools.js',*/}
                    {/*        ]*/}
                    {/*    }}/>*/}
                </Grid>
            </Grid>
        </div>
    </>;
}

export default EmailTemplate