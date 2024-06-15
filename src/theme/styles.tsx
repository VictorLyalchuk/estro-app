import { makeStyles, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(0),
        },
        input: {},
        button: {
            textTransform: 'none',
             marginBottom: "3px"
        },
        withoutLabel: {
            marginTop: theme.spacing(3),
        },
        textField: {
            '& .MuiInputBase-root': {
                height: '60px',
            },
        },
        googleButton: {
            textTransform: 'none',
            backgroundColor: '#4285F4',
            color: '#fff',
            '&:hover': {
                backgroundColor: '#357ae8',
            },
            margin: theme.spacing(1, 0),
        },
    }),
);