import {Formik, Form} from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import AppTheme from "../template/shared-theme/AppTheme.tsx";
import ColorModeSelect from "../template/shared-theme/ColorModeSelect.tsx";
import CustomField from "./CustomField.tsx";
import {TYPE_FIELD} from "../helper/constant.ts";
import {useDispatch} from "react-redux";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import {LoginRequest} from "../model/user.ts";
import { useStore } from '../context/StoreContext.tsx';
import {loginUser} from "../redux/auth/authSlice.ts";
import {useAppDispatch} from "../hook/hook.ts";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
}));

const SignInContainer = styled(Stack)(({theme}) => ({
    height: '100vh',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function SignIn(props: any) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const handleSubmit = (fromData: LoginRequest) => {
        dispatch(loginUser(fromData));
    };
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <SignInContainer direction="column" justifyContent="center">
                <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
                <Card variant="outlined">
                    <Typography component="h1" variant="h4">Sign in</Typography>
                    <Formik
                        initialValues={{username: '', password: ''}}
                        validationSchema={validationSchema}
                        onSubmit={async (values: LoginRequest) => {
                            handleSubmit(values)
                            navigate("/")
                        }}
                    >
                        {({errors, touched, handleBlur, isSubmitting}) => (
                            <Box
                                className={"flex flex-col w-full gap-2"}
                                component={Form}
                                noValidate
                            >
                                <FormControl fullWidth>
                                    <CustomField
                                        name="username"
                                        label="User name"
                                        type={TYPE_FIELD.INPUT}
                                        touched={touched}
                                        errors={errors}
                                        onBlur={handleBlur}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <CustomField
                                        name="password"
                                        label="Password"
                                        type={TYPE_FIELD.PASSWORD}
                                        touched={touched}
                                        errors={errors}
                                        onBlur={handleBlur}
                                        className="w-full"
                                    />
                                </FormControl>
                                <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
                                    Sign in
                                </Button>
                                <Link component="button" type="button" variant="body2" sx={{alignSelf: 'center'}}>
                                    Forgot your password?
                                </Link>
                            </Box>
                        )}
                    </Formik>
                </Card>
            </SignInContainer>
        </AppTheme>
    );
}
