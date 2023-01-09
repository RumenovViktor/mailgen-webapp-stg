import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    content: {
      height: 600,
      width: '100%',
      padding: theme.spacing(0, 0, 0, 29),
      ...theme.mixins.toolbar,
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    createTemplate: {
      backgroundColor: '#009be5', 
      color: 'white', 
    },
    createTemplateContainer: {
      margin: theme.spacing(0, 0, 1.5, 0),
    }
  }));

  export default useStyles