import React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    elementBlock: {
        width: '23.5%',
        height: '100px',
        border: '1px solid black',
        display: 'inline-block',
        marginLeft: '0.5%',
        marginRight: '1%',
        marginTop: '1.5%',
        borderColor: '#90A4AE',
        borderRadius: 10
    },
    dropArea: {
        float: 'right',
        width: '65%',
        height: '800px',
        marginRight: '3%'
    }
}));

export default useStyles