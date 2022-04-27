import { useContext, useEffect, useState } from 'react';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// eslint-disable-next-line
import { BlogDialog, BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
// import POSTS from '../_mock/blog';
import { AuthContext } from '../App';

// ----------------------------------------------------------------------

// const SORT_OPTIONS = [
//   { value: 'latest', label: 'Latest' },
//   { value: 'popular', label: 'Popular' },
//   { value: 'oldest', label: 'Oldest' },
// ];

// ----------------------------------------------------------------------

export default function Blog() {
  const { access } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/blog/blog-post/', {
        headers: {
          'Authorization': `Bearer ${access}`
        }
      })
      .then((response) => {
        console.log(response.data)
        setPosts(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [access])

  return (
    <Page title="Dashboard: Blog">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Post
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          {/* <BlogPostsSearch posts={POSTS} /> */}
          {/* <BlogPostsSort options={SORT_OPTIONS} /> */}
        </Stack>

        <Grid container spacing={3}>
          {posts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
        <BlogDialog open={open} setOpen={setOpen} posts={posts} />
      </Container>
    </Page>
  );
}
