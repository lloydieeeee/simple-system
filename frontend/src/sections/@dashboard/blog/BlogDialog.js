import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../../App';

BlogDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  posts: PropTypes.array,
};

export default function BlogDialog({ open, setOpen, posts }) {
  const { access, csrf } = React.useContext(AuthContext);
  // const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    const body = {
      title: data.title
    }

    axios
      .post('http://localhost:8000/blog/blog-post/', body, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${access}`,
          'x-csrftoken': csrf
        }
      })
      .then((response) => {
        posts.push(response.data)
        setOpen(false)
        reset()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Post a Blog</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To post a blog to this website, please enter your thoughts or something that interesting here.
            </DialogContentText>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <TextField
                  // autoFocus
                  margin="dense"
                  label="Body"
                  type="text"
                  fullWidth
                  multiline
                  rows={6}
                  variant="standard"
                  {...register('title')}
                />
              </div>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit'>Post</Button>
            </form>
          </DialogContent>
          {/* <DialogActions> */}
          {/*   <Button onClick={handleClose}>Cancel</Button> */}
          {/*   <Button type='submit'>Post</Button> */}
          {/* </DialogActions> */}
      </Dialog>
    </div>
  );
}
