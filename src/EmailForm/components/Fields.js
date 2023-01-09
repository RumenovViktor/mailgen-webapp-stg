import React from 'react'
import {Card, CardContent, Grid, Typography} from "@mui/material";
import Tags from "../../components/Tags";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const AvailableFormFields = (props) => {
    const {
        selectedTags,
        setTags,
        fields,
        fieldsHandler
    } = props

    return <>
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item>
                        <Typography>
                            Fields
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={5} padding={1}>
                    <Grid item>
                        <Tags
                            selectedTags={selectedTags}
                            setTags={setTags}
                        />
                    </Grid>
                </Grid>
                <Grid container padding={1}>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={fields.firstName}
                                    onChange={(event) => fieldsHandler({...fields, firstName: event.target.checked})}
                                    name="firstNameCheckBox"
                                    color="primary"
                                />
                            }
                            label="First Name Field"
                        />
                    </Grid>
                </Grid>
                <Grid container padding={1}>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={fields.lastName}
                                    onChange={(event) => fieldsHandler({...fields, lastName: event.target.checked})}
                                    name="lastNameCheckBox"
                                    color="primary"
                                />
                            }
                            label="Last Name Field"
                        />
                    </Grid>
                </Grid>
                <Grid container padding={1}>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={fields.birthDate}
                                    onChange={(event) => fieldsHandler({...fields, birthDate: event.target.checked})}
                                    name="birthDateCheckBox"
                                    color="primary"
                                />
                            }
                            label="Birth Date Fields"
                        />
                    </Grid>
                </Grid>
                <Grid container padding={1}>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={fields.phoneNumber}
                                    onChange={(event) => fieldsHandler({...fields, phoneNumber: event.target.checked})}
                                    name="phoneNumberCheckBox"
                                    color="primary"
                                />
                            }
                            label="Phone Number Field"
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </>
}

export default AvailableFormFields