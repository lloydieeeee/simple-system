import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState } from 'react-hook-form';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
// component
import Iconify from '../../../components/Iconify';
import { AuthContext } from '../../../App';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { csrf } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const { control, register, handleSubmit } = useForm({
    mode: 'all',
    resolver: yupResolver(RegisterSchema)
  });

  const { errors, isSubmitting } = useFormState({
    control
  });

  const onSubmit = (data) => {
    const body = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      password: data.password
    }

    axios
      .post('http://localhost:8000/user/register/', body, {
        withCredentials: true,
        headers: {
          'x-csrftoken': csrf
        }
      })
      .then((response) => {
        // setAccess(response.data.access);
        // setRefresh(response.data.refresh);
        console.log(response.data)
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="First name"
            {...register('firstName')}
            error={Boolean(errors.firstName)}
            helperText={Boolean(errors.firstName) && errors.firstName.message}
          />

          <TextField
            fullWidth
            label="Last name"
            {...register('lastName')}
            error={Boolean(errors.lastName)}
            helperText={Boolean(errors.lastName) && errors.lastName.message}
          />
        </Stack>

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
                <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(errors.password)}
          helperText={Boolean(errors.password) && errors.password.message}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </form>
  );
}
