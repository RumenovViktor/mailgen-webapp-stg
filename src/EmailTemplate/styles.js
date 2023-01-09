import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    content: {
      display: 'flex',
      padding: theme.spacing(0, 0, 0, 38),
      ...theme.mixins.toolbar,
    },
    main: {
      padding: theme.spacing(0, 0, 0, 30),
    },
    save: {
      backgroundColor: '#009be5',
      color: 'white',
      margin: theme.spacing(2.5, 0, 0, 20)
    },
    name: {
      margin: theme.spacing(0, 148, 1, 0)
    },
    fieldsContainer: {
      margin: theme.spacing(10, 0, 0, 28)
    }
  }));

  export default useStyles