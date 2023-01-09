import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    loaderContent: {
        width: '100%',
        padding: theme.spacing(1, 0, 0, 31),
        ...theme.mixins.toolbar,
    },
    content: {
        width: '100%',
        padding: theme.spacing(0, 0, 0, 29),
        ...theme.mixins.toolbar,
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    createAutoEmail: {
      backgroundColor: '#009be5', 
      color: 'white', 
    },
    createAutoEmailContainer: {
      margin: theme.spacing(0, 0, 1.5, 0),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
  }));

  export default useStyles