import {
  Box, Flex, Image, useBreakpointValue,
} from '@chakra-ui/react';
import React, {
  useEffect, useState,
} from 'react';

import Cookies from 'js-cookie';
import Logo from '../assets/logo.svg';
import { MessageIcon } from '../icons';
import { PostCard, PostCardSkeleton } from '../components';
import sendHttpRequest from '../sendHttpRequest';

const Home = () => {
  document.title = 'Home - Piclounge';

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = () => {
    sendHttpRequest('GET', '/post/all', {
      'Content-Type': 'application/json',
      'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
    }, null)
      .then((res) => {
        setPosts(res.data);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const loadPostDelay = setTimeout(() => {
      loadPosts();
    }, 1500);

    return () => clearTimeout(loadPostDelay);
  }, []);

  return (
    <>

      {
        isMobile && (
          <Box
            position={isMobile ? 'fixed' : 'relative'}
            top={isMobile ? 0 : 90}
            w="100%"
            bg="white"
            boxShadow="sm"
            zIndex={1}
            p={2}
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              p={1}
            >
              <Image
                boxSize="40px"
                src={Logo}
              />
              <Box
                onClick={() => {
                  window.open('https://chat-with-messenger.vercel.app', '_blank');
                }}
              >
                <MessageIcon />
              </Box>
            </Flex>
          </Box>
        )
      }
      <Box
        w={{ base: '100%', md: '30%' }}
        margin="auto"
      >
        <Flex
          w="100%"
          mt={isMobile ? 20 : 10}
          flexDirection="column"
          gap={6}
        >
          {
            isLoading ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            )
              : (
                posts.map((post) => (
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
                    isFollowed={post.isFollowed}
                  />
                ))
              )
          }
        </Flex>
      </Box>
    </>
  );
};

export default Home;
