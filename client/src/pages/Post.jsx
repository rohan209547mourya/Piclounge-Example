import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { PostCard } from '../components';
import sendHttpRequest from '../sendHttpRequest';

const Post = () => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    sendHttpRequest(
      'GET',
      `/post/${postId}/1`,
      {
        'Content-Type': 'application/json',
      },
      null,
    ).then((res) => {
      setPost(res.data.post);
    });
  }, [postId]);

  return (
    <Box
      width={{ base: '100%', sm: '30%' }}
      margin="auto"
      marginTop="5%"
    >
      {post != null && (
        <PostCard
          caption={post.caption}
          name={post.user.name}
          username={post.user.username}
          profileImage={post.user.profileImage}
          postCoverImage={post.image}
          likes={post.likes}
          createdAt={post.createdAt}
          comments={[]}
          // eslint-disable-next-line no-underscore-dangle
          postId={post._id}
          // eslint-disable-next-line no-underscore-dangle
          key={post._id}
          // eslint-disable-next-line no-underscore-dangle
          userId={post.user._id}
          isFollowed
        />
      )}
    </Box>
  );
};

export default Post;
