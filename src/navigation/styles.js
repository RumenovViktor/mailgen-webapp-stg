import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
        logo: {
            // height: 40,
            marginTop: 10,
            marginBottom: 30,
            background: 'rgba(255, 255, 255, 0.3)',
            paddingBottom: 5
        },

        siteLayoutBackground: {
            background: '#fff',
            boxShadow: 'rgb(0 0 0 / 15%) 0px 1px 4px -1px'
        }
    }
))

export default useStyles