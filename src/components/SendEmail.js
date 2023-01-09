import * as React from 'react'
import {Button, Grid, TextField} from "@material-ui/core";
import MailOutline from "@material-ui/icons/MailOutline";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {useState} from "react";
import EmailTemplateSelect from "./EmailTemplateSelect";
import Tags from "./Tags";
import {getConfig} from "../config";
import {useAuth0} from "@auth0/auth0-react";

const SendEmail = (props) => {
    const {byTag, model, disabled} = props
    
    const [sendEmailOpened, setSendEmailsOpen] = useState(false)
    const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('')
    const [subject, setSubject] = useState('')
    const [senderEmail, setSenderEmail] = useState('')
    const [senderName, setSenderName] = useState('')
    const [tags, setTags] = React.useState([])
    const [sendEmailButtonDisabled, setSendEmailButtonStatusDisabled] = useState(false)

    const {getAccessTokenSilently} = useAuth0();
    const config = getConfig()

    const sendEmails = async () => {
        setSendEmailButtonStatusDisabled(true)
        const request = {
            Subject: subject,
            SenderEmail: senderEmail,
            SenderName: senderName,
            EmailTemplateId: selectedEmailTemplate,
            Subscribers: model.selectedIds,
            Tags: tags
        }

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
            body: JSON.stringify(request)
        }

        fetch(`${process.env.REACT_APP_API_BASE}/emails/sendMassEmails`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setSendEmailsOpen(false)
                setSendEmailButtonStatusDisabled(false)
            })
            .catch(err => console.log(err))
    }
    
    return <>
        <Button
            color="primary"
            startIcon={<MailOutline />}
            disabled={disabled}
            onClick={() => setSendEmailsOpen(true)}
        >
            {byTag ? 'Send Emails By Tags' : 'Send Emails'}
        </Button>
        <Dialog
            open={sendEmailOpened}
            keepMounted
            onClose={() => setSendEmailsOpen(false)}
            maxWidth={"md"}
            fullWidth={true}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle id="alert-dialog-slide-title">{'Send Mass Emails'}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item>
                        <TextField
                            value={subject}
                            onChange={(x) => setSubject(x.target.value)}
                            label="Subject"
                            variant="standard" />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        <TextField
                            value={senderEmail}    
                            onChange={(x) => setSenderEmail(x.target.value)} 
                            label="Sender email" 
                            variant="standard" />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item spacing={2}>
                        <TextField
                            value={senderName}
                            onChange={(x) => setSenderName(x.target.value)}    
                            xs={12} 
                            label="Sender Name" 
                            variant="standard" />
                    </Grid>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <EmailTemplateSelect
                            disabled={false}
                            value={selectedEmailTemplate}
                            handler={setSelectedEmailTemplate}/>
                    </Grid>
                </Grid>
                {byTag ? <Grid container spacing={1}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Tags selectedTags={tags} setTags={setTags}/>
                        </Grid>
                    </Grid>
                </Grid> : ''}
            </DialogContent>
            <DialogActions>
                <Button disabled={sendEmailButtonDisabled} color="primary" onClick={sendEmails}>
                    Send Emails
                </Button>
            </DialogActions>
        </Dialog>
    </>
}

export default SendEmail