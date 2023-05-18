/* eslint-disable no-underscore-dangle */
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { SiWhatsapp, SiFacebook } from 'react-icons/si';
import {
  CommentIcon,
  HeartIcon,
  ShareIcon,
  HeartIconFilled,
} from '../../icons';
import { GlobalContext } from '../../context/GlobalContext';
import sendHttpRequest, { followNewUserRequest } from '../../sendHttpRequest';
import CommentModal from '../comments/CommentModal';

const intToString = (num) => {
  // eslint-disable-next-line no-param-reassign
  num = num.toString().replace(/[^0-9.]/g, '');
  if (num < 1000) {
    return num;
  }
  const si = [
    { v: 1e3, s: 'K' },
    { v: 1e6, s: 'M' },
    { v: 1e9, s: 'B' },
    { v: 1e12, s: 'T' },
    { v: 1e15, s: 'P' },
    { v: 1e18, s: 'E' },
  ];
  let index;
  // eslint-disable-next-line no-plusplus
  for (index = si.length - 1; index > 0; index--) {
    if (num >= si[index].v) {
      break;
    }
  }
  return (
    (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1')
        + si[index].s
  );
};

const PostCard = ({
  profileImage,
  username,
  name,
  caption,
  postCoverImage,
  isFollowed,
  createdAt,
  likes,
  comments,
  userId,
  postId,
}) => {
  dayjs.extend(relativeTime);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { userData } = useContext(GlobalContext);
  const [isLiked, setIsLiked] = useState(userData.likedPosts?.includes(postId));
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [followed, setFollowed] = useState(isFollowed);
  const toast = useToast();
  const {
    isOpen: isCommentDrawerOpen,
    onClose: onCommentDrawerClose,
    onOpen: onCommentDrawerOpen,
  } = useDisclosure();
  const {
    isOpen: isShareOpen,
    onClose: onShareClose,
    onOpen: onShareOpen,
  } = useDisclosure();
  const buttonRef = useRef();

  const handleLikeThisPost = () => {
    sendHttpRequest(
      'PUT',
      `/post/like/${postId}`,
      {
        'Content-Type': 'application/json',
        'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
      },
      {},
    ).then((res) => {
      setLikeCount(res.data.post.likes.length || 0);
      setIsLiked(!isLiked);
    });
  };

  const handleFollowRequest = async () => {
    const response = await followNewUserRequest(userId);
    if (response.status === 200) {
      setFollowed(true);
      toast({
        title: 'Added to your following list!',
        status: 'success',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Card
        h={{ base: '100%', md: '30%' }}
        maxW="md"
        boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;"
        id={postId}
      >
        <CardHeader pt={2} pb={2}>
          <Flex>
            <Box flex={1}>
              <NavLink to={`/profile/${userId}`} _hover={{ cursor: 'pointer' }}>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar name={name} src={profileImage} />
                  <Box>
                    <Heading size="sm">{name}</Heading>
                    <Text>
                      @
                      {username}
                    </Text>
                  </Box>
                </Flex>
              </NavLink>
            </Box>
            {!followed && username !== userData.username && (
              <Button
                onClick={handleFollowRequest}
                bg="var(--primary-light-color)"
                color="white"
                _hover={{ bg: '#e7735c' }}
              >
                Follow
              </Button>
            )}
          </Flex>
        </CardHeader>
        <CardBody pt={2} pb={2}>
          <Text>{caption}</Text>
        </CardBody>
        <Image
          borderTop="1px solid #ccc"
          borderBottom="1px solid #ccc"
          objectFit="cover"
          src={postCoverImage}
          alt="Piclounge post"
        />
        <CardBody pt={2} pb={2}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text>
              Liked by
              {' '}
              <strong>
                {intToString(likeCount)}
                {' '}
                {likeCount === 1 ? 'person' : 'people'}
              </strong>
            </Text>
            <Text>{dayjs(createdAt).fromNow()}</Text>
          </Flex>
        </CardBody>
        <CardFooter
          justify="space-between"
          flexWrap="wrap"
          sx={{
            '& > button': {
              minW: '136px',
            },
          }}
        >
          {isMobile ? (
            <>
              <Flex onClick={handleLikeThisPost}>
                {isLiked ? <HeartIconFilled /> : <HeartIcon />}
              </Flex>
              <Flex
                onClick={onCommentDrawerOpen}
                ref={buttonRef}
              >
                <CommentIcon />
              </Flex>
              <Flex
                onClick={onShareOpen}
              >
                <ShareIcon />
              </Flex>
            </>
          ) : (
            <>
              <Button
                flex="1"
                variant="ghost"
                leftIcon={
                  isLiked ? (
                    <HeartIconFilled />
                  ) : (
                    <HeartIcon />
                  )
                }
                _hover={{ bg: 'transparent' }}
                onClick={handleLikeThisPost}
              >
                Like
              </Button>
              <Button
                flex="1"
                variant="ghost"
                leftIcon={<CommentIcon />}
                _hover={{ bg: 'transparent' }}
                onClick={onCommentDrawerOpen}
                ref={buttonRef}
              >
                Comment
              </Button>
              <Button
                flex="1"
                variant="ghost"
                leftIcon={<ShareIcon />}
                _hover={{ bg: 'transparent' }}
                onClick={onShareOpen}
              >
                Share
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      <CommentModal
        buttonRef={buttonRef}
        isCommentDrawerOpen={isCommentDrawerOpen}
        onCommentDrawerClose={onCommentDrawerClose}
        postId={postId}
      />
      <Modal isOpen={isShareOpen} onClose={onShareClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap="4">
              <Button
                colorScheme="blue"
                onClick={() => {
                  navigator.clipboard.writeText(`https://piclounge.vercel.app/post/${postId}`);
                  toast({
                    title: 'Link copied!',
                    status: 'success',
                    isClosable: true,
                  });
                }}
              >
                <AiOutlinePaperClip />
              </Button>
              <Button
                colorScheme="whatsapp"
                _hover={{ cursor: 'pointer' }}
                onClick={() => {
                  const isDesktop = window.innerWidth >= 768;
                  if (isDesktop) {
                    window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(`https://piclounge.vercel.app/post/${postId}`)}`, '_blank');
                  } else {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`https://piclounge.vercel.app/post/${postId}`)}`, '_blank');
                  }
                }}
              >
                <SiWhatsapp />
              </Button>
              <Button
                colorScheme="facebook"
                as="a"
                _blank="true"
                _hover={{ cursor: 'pointer' }}
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=https://piclounge.vercel.app/post/${postId}`, '_blank');
                }}
              >
                <SiFacebook />
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

    </>
  );
};
export default PostCard;
