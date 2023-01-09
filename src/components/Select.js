import React from 'react'
import {
    InputLabel,
    FormControl,
    Select,
    MenuItem
} from "@material-ui/core"
import useStyles from '../NewsLetter/styles';
import { useEffect } from 'react';
import { useState } from 'react';

const SelectCustom = (props) => {
    const classes = useStyles();

    const {
        id,
        value,
        handler,
        labelName,
        options,
        disabled
    } = props
    
    const [optionsSource, setOptionsSource] = useState(options)
    
    useEffect(() => {
        setOptionsSource(options)
    }, [props.options])

    const handleChange = (event, action) => {
        action(event.target.value);
    }

    return <>
        <FormControl className={classes.formControl}>
            <InputLabel id={id}>{labelName}</InputLabel>
            <Select
                id={id}
                disabled={disabled}
                value={value}
                onChange={x => handleChange(x, handler)}
                displayEmpty
                className={classes.selectEmpty}
                inputProps={{ 'aria-label': 'Without label' }}
                error={value === ""}
                helperText={"The field is required"}>
                {optionsSource.map(x => <MenuItem value={x.id}>{x.name}</MenuItem>)}
            </Select>
        </FormControl>
    </>
}

export default SelectCustom