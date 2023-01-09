import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    content: {
        // display: 'flex',
        padding: theme.spacing(0, 0, 0, 28.5),
        ...theme.mixins.toolbar,
    },
    main: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    root: {
        // minWidth: 1560,
    },
    delete: {
        marginTop: 20
    },
    hidden: {
        display: 'none'
    },
    margin8: {margin: 8},
    fieldsText: {paddingBottom: 20, marginTop: 10},
    tagsTextField: {marginTop: 18, width: 190, marginLeft: 10},
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default useStyles