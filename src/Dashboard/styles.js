import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    content: {
        width: '100%',
        padding: theme.spacing(2, 3, 0, 31),
        ...theme.mixins.toolbar,
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));

export default useStyles