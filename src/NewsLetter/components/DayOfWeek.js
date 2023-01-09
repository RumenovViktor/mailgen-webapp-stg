import {Grid, Typography} from "@material-ui/core";
import React from "react";
import SelectCustom from "../../components/Select";

const DaysOfWeek = (props) =>{

    const options = [{
        id: 1,
        name: 'Monday'
    },{
        id: 2,
        name: 'Tuesday'
    },{
        id: 3,
        name: 'Wednesday'
    },{
        id: 4,
        name: 'Thirsday'
    },{
        id: 5,
        name: 'Friday'
    },{
        id: 6,
        name: 'Saturday'
    },{
        id: 7,
        name: 'Sunday'
    },]

    const repeatTypes = {
        Day: 0,
        Week: 1,
        Months: 2
    }
    
    const {
        selectedRepeatType, 
        value,
        handler} = props

    if (selectedRepeatType === repeatTypes.Week){
        return <>
            <Grid item>
                {/*<DaysOfWeekSelect value={dayOfWeek} handler={dayOfWeekHandler} />*/}
                <SelectCustom
                    id="repeat-select"
                    value={value}
                    labelName=""
                    handler={handler}
                    options={options} />
            </Grid>
            <Grid item style={{marginTop:"6%"}}>
                <Typography>at</Typography>
            </Grid>
        </>
    }
    return <span />;
}

export default DaysOfWeek