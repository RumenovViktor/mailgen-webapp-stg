import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    content: {
        // height: 600,
        width: '100%',
        padding: theme.spacing(0, 0, 0, 29),
        ...theme.mixins.toolbar,
    },
    formControl: {
        display: 'flex',
        padding: theme.spacing(0, 0, 0, 0)
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    main: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default useStyles