import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';
import { AuthContext } from '../../../App';


UserDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  id: PropTypes.number,
};

export default function UserDialog({ open, setOpen, id }) {
  const { access, csrf } = React.useContext(AuthContext);
  const { control, handleSubmit } = useForm();
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    const body = {
      is_active: data.is_active.value
    }

    axios
      .put(`http://localhost:8000/user/activate-user/${id}/`, body, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${access}`,
          'x-csrftoken': csrf
        }
      })
      .then((response) => {
        console.log(response.data)
        setOpen(false)
      })
      .catch((error) => {
        console.error(error)
      })
  };

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        fullWidth
        maxWidth={'md'}
        PaperProps={{
          sx: {
            height: 300
          },
          style: {
            overflowY: 'visible'
          }
        }}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Update User"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent style={{ overflowY: 'visible' }}>
            <DialogContentText id="alert-dialog-slide-description">
              User
            </DialogContentText>
            <Controller
              name='is_active'
              control={control}
              render={({ field }) => 
                <Select
                  {...field}
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  options={[
                    { value: true, label: 'Activate'},
                    { value: false, label: 'Deactivate'}
                  ]} 
                />
              }
            />
          </DialogContent>
          <DialogActions style={{ marginTop: '4rem' }}>
            <Button onClick={handleClose}>Disagree</Button>
            <Button type='submit'>Agree</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
