import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { useFormik, Form, FormikProvider } from 'formik';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
// component
import Iconify from '../../../components/Iconify';
import { AuthContext } from '../../../App';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { csrf, setAccess, setRefresh } = useContext(AuthContext);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const { control, register, handleSubmit } = useForm({
    mode: 'all',
    resolver: yupResolver(LoginSchema)
  });

  const { errors, isSubmitting } = useFormState({
    control
  });

  const onSubmit = (data) => {
    const body = {
      email: data.email,
      password: data.password
    }

    axios
      .post('http://localhost:8000/user/login/', body, {
        withCredentials: true,
        headers: {
          'x-csrftoken': csrf
        }
      })
      .then((response) => {
        setAccess(response.data.access);
        setRefresh(response.data.refresh);
        navigate('/dashboard/app', { replace: true });
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // const formik = useFormik({
  //   initialValues: {
  //     email: '',
  //     password: '',
  //     remember: true,
  //   },
  //   validationSchema: LoginSchema,
  //   onSubmit: () => {
  //     navigate('/dashboard', { replace: true });
  //   },
  // });
  //
  // const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;


  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          autoComplete="username"
          type="email"
          label="Email address"
          {...register('email')}
          error={Boolean(errors.email)}
          helperText={Boolean(errors.email) && errors.email.message}
        />

        <TextField
          fullWidth
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          {...register('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(errors.password)}
          helperText={Boolean(errors.password) && errors.password.message}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <FormControlLabel
          control={<Checkbox {...register('remember')} />}
          label="Remember me"
        />

        <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </form>
  );
}
