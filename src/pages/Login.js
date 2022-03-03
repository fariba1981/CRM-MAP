import {useState ,useEffect } from 'react';
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import apiPath from '../api'
// material
import { styled } from '@mui/material/styles';
import {
  Card, 
  Stack, 
  Link, 
  Container, 
  Typography,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import AuthSocial from '../components/authentication/AuthSocial';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {


  const navigate = useNavigate();

  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[loading,setLoading] = useState(false);
  const[errors,setErrors] = useState({})

  useEffect(()=>{

  },[loading]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleChangeEmail =  (event) => {
    if(validateEmail(event.target.value)){
        setEmail(event.target.value)
        setErrors({
            ...errors,
            email: null
        })
    } else {
        setErrors({
            ...errors,
            email : 'email is not valid'
        })
    }
}

const handleChangePassword =  (event) => {
       setPassword(event.target.value)
}

const handleLogin = () =>{
  setLoading(true);
        fetch(apiPath.auth.login, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.hasOwnProperty('message')) {
              setErrors({
                ...errors,
                massage : 'Email or password is wrong!'
            });            
              } else {
                fetch(apiPath.auth.me  + `?tokencheck=${data['x-auth-token']}`, {
                    method: 'GET',
                }).then((res) => {
                    return res.json();
                }).then((meData) => {
                    localStorage.setItem("user", JSON.stringify({
                        id: meData.decode._id,
                        name: meData.decode.name,
                        email: meData.decode.email,
                        vip : meData.decode.vip,
                        token: data['x-auth-token']
                    }));
                    let userf = JSON.parse(localStorage.getItem('user'))
                    if (userf.vip) {
                      navigate('/dashboard/app', { replace: true })
                    } else {     
                      navigate('/404', { replace: true })
                    }

                });
            }
        })
}


console.log(errors)

  return (
    <RootStyle title="Login | Minimal-UI">
      <AuthLayout>
        Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Get started
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/isps.jpg" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Sign in Atlantis internet service
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
          </Stack>

          <AuthSocial />

          {/* Start LoginForm  */}



          <Stack spacing={3}>
          <TextField
            fullWidth
            type="email"
            label="Email address"
            onChange={handleChangeEmail}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type='password'
            label="Password"
            onChange={handleChangePassword}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>

        <Typography sx={{ color: 'red' }}>{errors.massage}</Typography>
          {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleLogin}
        >
          Login
        </LoadingButton>



          {/* end login form */}

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don’t have an account?&nbsp;
              <Link variant="subtitle2" component={RouterLink} to="register">
                Get started
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
