import React, {useEffect, useState} from 'react'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slide, Typography} from "@mui/material";
import DialogContentText from "@material-ui/core/DialogContentText";
import {useHistory} from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EmailTemplateTypes = {
    Simple: 0,
    Builder: 1
}

const EmailTemplateTypeModal = (props) => {
    const history = useHistory()
    
    const [selectedEmailTemplateType, setSelectedEmailTemplateType] = useState(null)
    const [activeSelection, setActiveSelection] = useState({
        simple: false,
        builder: false
    })
    
    const goToPage = () => {
        if (selectedEmailTemplateType === EmailTemplateTypes.Simple){
            history.push('/simple-template')
        }
    };
    
    const onSelectedSimpleTemplate = (ev) => {debugger
        setSelectedEmailTemplateType(EmailTemplateTypes.Simple)
        setActiveSelection({
            simple: true,
            builder: false
        })
    }

    const onSelectedBuilderTemplate = (ev) => {
        setSelectedEmailTemplateType(EmailTemplateTypes.Builder)
        setActiveSelection({
            simple: false,
            builder: true
        })
    }
    
    useEffect(() => {
        props.setOpen(props.open)
    }, [props.open])

    return (
        <div>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => props.setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Please choose a type of email template tool:"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box
                                    onClick={(ev) => onSelectedSimpleTemplate(ev)}
                                    sx={{
                                        height: 100,
                                        border: 1,
                                        borderColor: activeSelection.simple ? 'primary.main' : 'grey',
                                        borderRadius: 3,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        '&:hover': {
                                            opacity: [0.9, 0.8, 0.7],
                                        },
                                    }}>
                                    <Typography style={{
                                        position: 'absolute',
                                        top: 50,
                                        transform: 'translate(0, -50%)',
                                        color: activeSelection.simple ? 'primary.main' : 'grey',
                                    }}>Simple Template</Typography>
                                </Box>
                                <Box sx={{marginTop: 1,textAlign: 'center', maxWidth: 200}}>
                                    <Typography fontSize={14}>
                                        Rich text editor with the ability to use tags.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    onClick={(ev) => onSelectedBuilderTemplate(ev)}
                                    sx={{
                                        height: 100,
                                        border: 1,
                                        borderColor: activeSelection.builder ? 'primary.main' : 'grey',
                                        borderRadius: 3,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        '&:hover': {
                                            opacity: [0.9, 0.8, 0.7],
                                        },
                                    }}>
                                    <Typography style={{
                                        position: 'absolute',
                                        top: 50,
                                        transform: 'translate(0, -50%)',
                                        color: activeSelection.builder ? 'primary.main' : 'grey',
                                    }}>Template Builder</Typography>
                                </Box>
                                <Box sx={{marginTop: 1,textAlign: 'center', maxWidth: 200}}>
                                    <Typography fontSize={14}>
                                        Drag and Drop email templates builder.
                                    </Typography>
                                </Box>
                                <Box sx={{marginTop: 1,textAlign: 'center', maxWidth: 200}}>
                                    <Typography fontSize={14} color={'#E67E22'}>
                                        Not Available yet :(
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={selectedEmailTemplateType === null || selectedEmailTemplateType !== EmailTemplateTypes.Simple} onClick={goToPage}>Continue</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EmailTemplateTypeModal