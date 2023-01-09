import React from 'react'
import { withStyles, Checkbox, FormControlLabel} from '@material-ui/core';

const CheckboxCustom = (props) => {
    const {
        checked,
        handler,
        name,
        labelName
    } = props

    const StyledCheckbox = withStyles({
        root: {
          color: '#009be5',
          '&$checked': {
            color: '#009be5',
          },
        },
        checked: {},
      })((props) => <Checkbox color="default" {...props} />);

    return <>
        <FormControlLabel
            control={
                <StyledCheckbox
                    checked={checked}
                    onChange={handler}
                    name={name}
                    color="primary"
                />
            }
            label={labelName}
        />
    </>
}

export default CheckboxCustom