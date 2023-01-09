import React, {useEffect, useState} from 'react'
import {
    Card,
    CardActions,
    CardContent,
    Typography,
    Grid,
    Button,
    Divider,
    TextField
} from "@material-ui/core"
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import useStyles from './styles'
import SelectCustom from '../components/Select'
import Tags from '../components/Tags'
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {types, repeatTypes, endTypes} from './sources/types';
import EmailTemplateSelect from '../components/EmailTemplateSelect';
import {getConfig} from "../config";
import {useAuth0} from "@auth0/auth0-react";
import queryString from "query-string";
import {useHistory} from "react-router-dom";
import LastDayOfMonth from "./components/LastDayOfMonth";
import DaysOfWeek from "./components/DayOfWeek";
import DayOfMonth from "./components/DayOfMonth";
import validateEmail from "../utils/ValueValidations";
import CheckboxCustom from "./components/checkbox";

const Newsletter = (props) => {
    const classes = useStyles()
    const config = getConfig()
    const history = useHistory()
    const {getAccessTokenSilently} = useAuth0();
    
    const {type, model, disableScheduling} = props
    
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [senderName, setSenderName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [rssUrl, setRssUrl] = useState("");
    const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('');
    const [selectedRepeatType, setSelectedRepeatType] = useState(0)
    const [selectedEndType, setSelectedEndType] = useState(0)
    const [selectedEndDate, setSelectedEndDate] = useState(new Date())
    const [selectedEndTime, setSelectedEndTime] = useState(new Date())
    const [dayOfWeek, setDayOfWeek] = useState(1)
    const [tags, setTags] = React.useState([])
    const [state, setState] = useState({
        onlyLastDayOfMonth: false,
        enableOpenRate: true,
        enableClickTracking: true
    });
    const [selectedDate, setSelectedDate] = React.useState(new Date())
    const [selectedDay, setSelectedDay] = React.useState(1)
    const [buttonDisabled, setButtonDisabled] = React.useState(false)

    const campaignId = queryString.parse(props.location.search).campaignId

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleRssUrlChange = (event) => {
        setRssUrl(event.target.value);
    }

    const handleCheckboxChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
    };
    
    const setupFieldsOnUpdate = (campaign) => {
        setName(campaign.name)
        setSelectedEmailTemplate(campaign.emailTemplateId)
        setRssUrl(campaign.rssUrl)
        setTags(campaign.tags)
        setSelectedRepeatType(campaign.repeatType)
        setDayOfWeek(campaign.weekDay)
        setSelectedDate(campaign.repeatTime)
        setSelectedDay(campaign.dayOfMonth)
        setState({onlyLastDayOfMonth: campaign.onlyLastDayOfMonth, enableClickTracking: campaign.enableClickTracking, enableOpenRate: campaign.enableOpenRate})
        setSelectedEndDate(campaign.endDate)
        setSelectedEndTime(campaign.endTime)
        setSubject(campaign.subject)
        setSenderEmail(campaign.senderEmail)
        setSenderName(campaign.senderName)
    }
    
    useEffect(() => {
        if ((!name || name.length < 3) ||
            (selectedEmailTemplate === "") ||
            (!validateEmail(senderEmail)) ||
            (!rssUrl || rssUrl.length < 3) ||
            (!subject || subject.length < 3) ||
            (tags.length <= 0)){
            setButtonDisabled(true)
        } else{
            setButtonDisabled(false)   
        }
    }, [name, selectedEmailTemplate, rssUrl, tags, subject, senderEmail])
    
    useEffect(() => {
        if (campaignId && model){
            setupFieldsOnUpdate(model)
        }
    }, [model])

    const upsert = async () => {
        const request = {
            campaignId: campaignId,
            name: name,
            subject: subject,
            senderName: senderName,
            senderEmail: senderEmail,
            rssUrl: rssUrl,
            type: type,
            emailTemplateId: selectedEmailTemplate,
            tags: tags,
            repeatType: selectedRepeatType,
            repeatTime: selectedDate,
            onlyLastDayOfMonth: state.onlyLastDayOfMonth,
            dayOfMonth: selectedDay,
            weekDay: dayOfWeek,
            endType: selectedEndType,
            endDate: selectedEndDate,
            endTime: selectedEndTime,
            enableOpenRate: state.enableOpenRate,
            enableClickTracking: state.enableClickTracking
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

        fetch(`${process.env.REACT_APP_API_BASE}/campaigns/upsertCampaign`, requestOptions)
            .then(response => response.json())
            .then(data => {
                history.push('/campaigns')
            })
            .catch(err => console.log(err))
    }

    return <>
        <Card className={classes.content}>
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item>
                        <TextField
                            error={!name && name.length < 3}
                            value={name}
                            helperText="Name is required and must be at least 3 characters"
                            onChange={handleNameChange}
                            label="Name"/>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <EmailTemplateSelect
                            disabled={disableScheduling}
                            value={selectedEmailTemplate}
                            handler={setSelectedEmailTemplate}/>
                    </Grid>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item>
                        <TextField 
                            value={rssUrl}
                            disabled={disableScheduling}
                            onChange={handleRssUrlChange} 
                            label="RSS Url"
                            error={!rssUrl || rssUrl.length < 3}
                            helperText={"Rss url is required and must be at least 3 characters"}
                        />
                    </Grid>
                </Grid>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                        <CheckboxCustom
                            checked={state.enableOpenRate}
                            handler={handleCheckboxChange}
                            name="enableOpenRate"
                            labelName="Enable open rates"
                        />
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title="This option enables you to see the rate of the emails that were opened.">
                            <InfoOutlinedIcon fontSize="small"/>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                        <CheckboxCustom
                            checked={state.enableClickTracking}
                            handler={handleCheckboxChange}
                            name="enableClickTracking"
                            labelName="Enable click tracking"
                        />
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title="This option enables you to track the link clicks in your emails.">
                            <InfoOutlinedIcon fontSize="small"/>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item>
                        <Grid container justifyContent={"left"} spacing={4}>
                            <Grid item>
                                <Tags selectedTags={tags} setTags={setTags}/>
                            </Grid>
                            <Grid item style={{marginTop:'1.5em'}}>
                                <Tooltip title="The campaign will run for the emails with the selected tags.">
                                    <InfoOutlinedIcon fontSize="small"/>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={10}>
                    <Grid item xs>
                        <Typography align={"left"}>Sender Details</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item xs>
                        <Divider/>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item>
                        <TextField
                            error={!subject && subject.length < 3}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            label="Subject"/>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item>
                        <TextField
                            value={senderName}
                            helperText="Optional. The name that your subscribers will see in their emails"
                            onChange={(e) => setSenderName(e.target.value)}
                            label="Sender Name"/>
                    </Grid>
                    <Grid item>
                        <TextField
                            error={!senderEmail && senderEmail.length < 3}
                            value={senderEmail}
                            helperText="The email that your subscribers will see in their emails"
                            onChange={(e) => setSenderEmail(e.target.value)}
                            label="Sender Email"/>
                    </Grid>
                </Grid>
                <Grid container spacing={10}>
                    <Grid item xs>
                        <Typography align={"left"}>Scheduling</Typography>
                    </Grid>
                </Grid>
                <div style={disableScheduling}>
                    <Grid container spacing={5}>
                        <Grid item xs>
                            <Divider/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item style={{marginTop:'1%'}}>
                                    <Typography align={"inherit"}>Repeat every:</Typography>
                                </Grid>
                                <Grid item>
                                    <SelectCustom
                                        value={selectedRepeatType}
                                        labelName=""
                                        handler={setSelectedRepeatType}
                                        options={repeatTypes}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5}>
                        <Grid item>
                            <LastDayOfMonth 
                                value={state.onlyLastDayOfMonth} 
                                handler={handleCheckboxChange} 
                                selectedRepeatType={selectedRepeatType} 
                            />
                            <Grid container alignItems="center" spacing={5}>
                                <DaysOfWeek 
                                    value={dayOfWeek} 
                                    handler={setDayOfWeek} 
                                    selectedRepeatType={selectedRepeatType} 
                                />
                                <DayOfMonth 
                                    value={selectedDay} 
                                    handler={setSelectedDay} 
                                    disabled={state.onlyLastDayOfMonth} 
                                    selectedRepeatType={selectedRepeatType} 
                                />
                                <Grid item>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardTimePicker
                                            margin="normal"
                                            id="time-picker"
                                            label="Time"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item style={{marginTop:"1%"}}>
                            <Typography>End On:</Typography>
                        </Grid>
                        <Grid item>
                            <SelectCustom
                                id="repeat-select"
                                value={selectedEndType}
                                labelName=""
                                handler={setSelectedEndType}
                                options={endTypes} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5}>
                        <Grid item>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disabled={selectedEndType === 0}
                                    margin="normal"
                                    id="time-picker"
                                    label="Date"
                                    value={selectedEndDate}
                                    onChange={setSelectedEndDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={2} >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardTimePicker
                                    disabled={selectedEndType === 0}
                                    margin="normal"
                                    id="date-picker"
                                    label="Time"
                                    value={selectedEndTime}
                                    onChange={setSelectedEndTime}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>
                </div>
                <Grid container spacing={5}>
                    <Grid item xs>
                        <Divider />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button disabled={buttonDisabled} variant="contained" color="primary" size="small" onClick={upsert}>Save</Button>
            </CardActions>
        </Card>
        {/*<Backdrop className={classes.backdrop} open={loading}>*/}
        {/*    <CircularProgress color={"inherit"} />*/}
        {/*</Backdrop>*/}
    </>
}

export default Newsletter