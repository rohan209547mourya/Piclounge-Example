/* eslint-disable no-underscore-dangle */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Box, Button, ButtonGroup, Flex, Image, Text, useBreakpointValue, useDisclosure, useToast,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { BackIcon, SettingsIcon } from '../icons';
import { GlobalContext } from '../context/GlobalContext';
import logo from '../assets/logo.svg';
import sendHttpRequest, { followNewUserRequest } from '../sendHttpRequest';
import { PostCard, PostCardSkeleton, SettingsDrawer } from '../components';

const intToString = (num) => {
  // eslint-disable-next-line no-param-reassign
  num = num.toString().replace(/[^0-9.]/g, '');
  if (num < 1000) {
    return num;
  }
  const si = [
    { v: 1E3, s: 'K' },
    { v: 1E6, s: 'M' },
    { v: 1E9, s: 'B' },
    { v: 1E12, s: 'T' },
    { v: 1E15, s: 'P' },
    { v: 1E18, s: 'E' },
  ];
  let index;
  // eslint-disable-next-line no-plusplus
  for (index = si.length - 1; index > 0; index--) {
    if (num >= si[index].v) {
      break;
    }
  }
  return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[index].s;
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { userData, currentUserData, setCurrentUserData } = useContext(GlobalContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isFollowing, setIsFollowing] = useState(false);
  const btnRef = useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData.following.includes(id)) {
      setIsFollowing(true);
    }
  }, [userData]);

  useEffect(() => {
    if (id === userData._id) {
      navigate('/profile/me');
    }

    if (id === 'me') {
      setCurrentUserData(userData);
    }

    if (id !== 'me') {
      sendHttpRequest('GET', `/user/${id}`, { 'Content-Type': 'application/json' }, null)
        .then((res) => {
          setCurrentUserData(res.data.user);
        })
        .catch((err) => {
          toast({
            title: 'User Not Found!',
            status: 'error',
            isClosable: true,
          });
          navigate('/profile/me');
        });
    }
  }, [id, userData, setCurrentUserData]);

  const handleUnFollowRequest = () => {
    sendHttpRequest(
      'PUT',
      `/user/unfollow/${id}`,
      {
        'Content-Type': 'application/json',
        'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
      },
      {},
    ).then((res) => {
      if (res.status === 200) {
        setIsFollowing(false);
        toast({
          title: 'Unfollowed!',
          status: 'warning',
          isClosable: true,
        });
      }
    });
  };

  const handleFollowRequest = async () => {
    const response = await followNewUserRequest(id);
    if (response.status === 200) {
      setIsFollowing(true);
      toast({
        title: 'Added to your following list!',
        status: 'success',
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    const loadPosts = () => {
      let urlId = userData.id;

      if (id !== 'me') {
        urlId = id;
      }

      sendHttpRequest('GET', `/post/${urlId}`, {
        'Content-Type': 'application/json',
        'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
      }, null)
        .then((res) => {
          setPosts(res.data.posts);
        }).finally(() => {
          setIsLoading(false);
        });
    };

    const loadPostDelay = setTimeout(() => {
      loadPosts();
    }, 1500);

    return () => clearTimeout(loadPostDelay);
  }, [userData, id]);

  return (
    <>
      <Flex
        w={{ base: '100%', md: '50%' }}
        p={5}
        margin="auto"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          onClick={() => navigate(-1)}
          _hover={{ cursor: 'pointer' }}
        >
          <BackIcon />
        </Box>
        <Box>
          <Text
            fontSize="xl"
            fontWeight="bold"
          >
            {
              id === 'me' ? 'My Profile' : 'User Profile'
            }
          </Text>
        </Box>

        <Box>
          {
            id === 'me' && (
              <Box
                _hover={{ cursor: 'pointer', transform: 'rotate(30deg)', transition: 'all 0.3s ease-in-out' }}
                onClick={onOpen}
                ref={btnRef}
              >
                <SettingsIcon />
              </Box>
            )
          }
        </Box>
      </Flex>
      {
        currentUserData.name !== '' ? (
          <Box
            w={{ base: '100%', md: '50%' }}
            margin="auto"
            mt={10}
          >
            <Flex
              w="50%"
              margin="auto"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Box>
                <Image
                  borderRadius="full"
                  boxSize="120px"
                  src={currentUserData.profileImage}
                />
              </Box>
              <Box>
                <Text
                  fontSize="2xl"
                  pt={3}
                  fontWeight="600"
                >
                  {currentUserData.name}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize="md"
                  fontWeight="500"
                  color="var(--secondary-light-text-color)"
                >
                  @
                  {currentUserData.username}
                </Text>
              </Box>
            </Flex>
            {
              currentUserData.username !== userData.username && (
                <Flex
                  w="50%"
                  margin="auto"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="row"
                  mt={5}
                >
                  <ButtonGroup>
                    {
                      isFollowing ? (
                        <Button
                          colorScheme="red"
                          onClick={handleUnFollowRequest}
                        >
                          Unfollow
                        </Button>
                      ) : (

                        <Button
                          bg="var(--primary-light-color)"
                          color="white"
                          onClick={handleFollowRequest}
                          _hover={{ bg: '#f86e52' }}
                        >
                          Follow
                        </Button>
                      )
                    }
                  </ButtonGroup>
                </Flex>
              )
            }
            <Flex
              w={{ base: '100%', md: '50%' }}
              margin="auto"
              alignItems="center"
              justifyContent="space-around"
              flexDirection="row"
              mt={10}
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Text
                  fontSize="md"
                  fontWeight="500"
                  color="var(--secondary-light-text-color)"
                >
                  Posts
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="600"
                >
                  {intToString(currentUserData.posts.length)}
                </Text>
              </Flex>
              <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Text
                  fontSize="md"
                  fontWeight="500"
                  color="var(--secondary-light-text-color)"
                >
                  Followers
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="600"
                >
                  {intToString(currentUserData.followers.length)}
                </Text>
              </Flex>
              <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Text
                  fontSize="md"
                  fontWeight="500"
                  color="var(--secondary-light-text-color)"
                >
                  Following
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="600"
                >
                  {intToString(currentUserData.following.length)}
                </Text>
              </Flex>
            </Flex>
            <Flex
              w="100%"
              margin="auto"
              mt={10}
            >
              <Flex
                border="2px solid var(--primary-light-color)"
                borderBottom="none"
                borderTopRightRadius="10px"
                borderTopLeftRadius="10px"
                alignItems="center"
                justifyContent="center"
                p={2}
                w="50%"
              >
                <Text
                  fontSize="xl"
                  fontWeight="500"
                  color="var(--primary-light-color)"
                >
                  Posts
                </Text>
              </Flex>
              <Flex
                border="2px solid var(--primary-light-color)"
                borderTop="none"
                borderLeft="none"
                borderRight="none"
                alignItems="center"
                justifyContent="center"
                p={2}
                w="50%"
              />
            </Flex>
            <Flex
              w="70%"
              margin="auto"
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
                        isFollowed
                      />
                    ))
                  )
              }
            </Flex>
          </Box>
        ) : (
          <Flex
            w="10%"
            margin="auto"
            alignItems="center"
            justifyContent="center"
            mt={40}
          >
            <Image
              width={100}
              src={logo}
              animation="spin infinite 5s linear"
            />
          </Flex>
        )
      }
      <SettingsDrawer
        btnRef={btnRef}
        onClose={onClose}
        isOpen={isOpen}
        setUserData={setCurrentUserData}
      />
    </>
  );
};

export default Profile;
