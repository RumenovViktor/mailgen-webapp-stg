import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    paddingLeft: theme.spacing.unit
  },

  input: {
    display: 'none',
  },

  circularProgress: {
    marginLeft: 0,

    marginRight: theme.spacing.unit,
  },

});

function ContainedButtons(props) {
  const { classes } = props;
  return (
    <div>
      <Button {...props} disabled={props.loading} style={{color: 'white'}}>
        {props.loading ? <CircularProgress style={{color: 'white'}} className={classes.circularProgress} size={20}/> : ''}
        {props.text}
      </Button>
    </div>
  );
}

ContainedButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContainedButtons);