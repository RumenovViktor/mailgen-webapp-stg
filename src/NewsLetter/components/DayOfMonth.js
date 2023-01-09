import {Grid, Typography} from "@material-ui/core";
import SelectCustom from "../../components/Select";
import React from "react";

const DayOfMonth = (props) => {
    const {
        selectedRepeatType,
        value,
        handler,
        disabled
    } = props

    const repeatTypes = {
        Day: 0,
        Week: 1,
        Months: 2
    }

    const numberOfDays = () => {
        return [...Array(31).keys()].map(x => {
            return {
                id: x + 1,
                name: x + 1
            }
        });
    }
    
    if (selectedRepeatType === repeatTypes.Months)
    {
        return <>
            <Grid item>
                <SelectCustom
                    id="days-select"
                    value={value}
                    labelName="Day"
                    handler={handler}
                    disabled={disabled}
                    options={numberOfDays} />
            </Grid>
            <Grid item style={{marginTop:"6%"}}>
                <Typography>at</Typography>
            </Grid>
        </>
    }

    return <span />
}

export default DayOfMonth