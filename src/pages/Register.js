import {useState ,useEffect } from 'react';
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import apiPath from '../api'
// material
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Card, 
  Link, 
  Container, 
  Typography ,
  Stack, 
  TextField,
  FormControl
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

export default function Register() {

  const navigate = useNavigate();


  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[firstName,setFirstName] = useState('');
  const[lastName,setLastName] = useState('');
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

const handleChangeFirstName =  (event) => {
  setFirstName(event.target.value)
}

const handleChangeLastName =  (event) => {
  setLastName(event.target.value)
}

const handleRegister = () =>{
  setLoading(true);
        fetch(apiPath.auth.register, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
                name : firstName + " " + lastName,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        }).then((response) => {
          console.log(response)
            return response.json();
        }).then((data) => {
            if (data.hasOwnProperty('message')) {
              setErrors({
                ...errors,
                massage : 'Email or password is wrong!'
            });            
              } else {
                      navigate('/activeaccount', { replace: true })
            }
        })
}



  return (
    <RootStyle title="Register | Minimal-UI">
      <AuthLayout>
        Already have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/login">
          Login
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Admin Panel
          </Typography>
          <img alt="register" src="/static/illustrations/isps.jpg" />
        </SectionStyle>
      </MHidden>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Get started absolutely free.
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Free forever. No credit card needed.
            </Typography>
          </Box>

          <AuthSocial />

          {/* Register form start */}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              onChange={handleChangeFirstName}
            />

            <TextField
              fullWidth
              label="Last name"
              onChange={handleChangeLastName}
            />
          </Stack>
          <br/>

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
          onClick={handleRegister}
        >
          Register
        </LoadingButton>





          {/* Register form end */}

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            By registering, I agree to Minimal&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              Privacy Policy
            </Link>
            .
          </Typography>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              Already have an account?&nbsp;
              <Link to="/login" component={RouterLink}>
                Login
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
