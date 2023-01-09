import {Grid} from "@material-ui/core";
import CheckboxCustom from "./checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import React from "react";

const LastDayOfMonth = (props) => {
    const {
        selectedRepeatType,
        value,
        handler
    } = props

    const repeatTypes = {
        Day: 0,
        Week: 1,
        Months: 2
    }
    
    if (selectedRepeatType === repeatTypes.Months){
        return <>
            <Grid container justifyContent="center" alignItems="center" spacing={1}>
                <Grid item>
                    <CheckboxCustom
                        checked={value}
                        handler={handler}
                        name="onlyLastDayOfMonth"
                        labelName="Only last day of the month"
                    />
                </Grid>
                <Grid item>
                    <Tooltip
                        title="Selecting this option will allow you to run the campaign at last the day of each month. If a day is not present for the current month, an email will not be sent.">
                        <InfoOutlinedIcon fontSize="small"/>
                    </Tooltip>
                </Grid>
            </Grid>
        </>
    }

    return <span />
}

export default LastDayOfMonth