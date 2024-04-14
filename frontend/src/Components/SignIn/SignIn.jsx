import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useUserContext } from '../../UserContext';
import LoginOptions from './LoginOptions';
import { Link as RouterLink, useNavigate } from 'react-router-dom';




// TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();

function SignIn() {
  const { email, setEmail, user } = useUserContext();
  const [showLogin, setShowLogin] = useState(false);
  const [mailVerified, setMailVerified] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      navigate('/');
    }
  }, [user])

  function handleNextPage(e) {
    e.preventDefault();
    setShowLogin(true);
  }

  return (
    <>

      {showLogin ? <LoginOptions email={email} mailVerified={mailVerified} setMailVerified={setMailVerified} /> : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form"  >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleNextPage}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Container>
      )}
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            {"Forgot password?"}
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </>

  )
};


export default SignIn;