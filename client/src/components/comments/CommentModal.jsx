/* eslint-disable no-underscore-dangle */
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CiPaperplane } from 'react-icons/ci';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import sendHttpRequest from '../../sendHttpRequest';

const CommentModal = ({
  isCommentDrawerOpen, onCommentDrawerClose, buttonRef, postId,
}) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState([]);
  const toast = useToast();

  const createNewCommentHandler = () => {
    setIsLoading(true);

    if (comment === '') {
      toast({
        title: 'You cannot create an empty comment!',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    sendHttpRequest('POST', `/comment/${postId}`, {
      'Content-Type': 'application/json',
      'X-Authorization': Cookies.get('pl_user_session_token'),
    }, {
      comment,
    })
      .then((res) => {
        toast({
          title: 'Comment created!',
          status: 'success',
          isClosable: true,
          position: 'top-right',
        });
        setComment('');
        setComments((prev) => [...prev, res.data.comment]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    sendHttpRequest('GET', `/comment/${postId}`, {
      'Content-Type': 'application/json',
    }, {}).then((res) => {
      setComments(res.data.comments);
    });
  }, [postId]);

  const handleCommentExpand = (commentId) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments((prevExpanded) => prevExpanded.filter((id) => id !== commentId));
    } else {
      setExpandedComments((prevExpanded) => [...prevExpanded, commentId]);
    }
  };

  const isCommentExpanded = (commentId) => expandedComments.includes(commentId);

  return (
    <Drawer
      isOpen={isCommentDrawerOpen}
      placement="bottom"
      onClose={onCommentDrawerClose}
      finalFocusRef={buttonRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent
        w={{ base: '100%', sm: '50%' }}
        margin="auto"
        borderTopRightRadius="20px"
        borderTopLeftRadius="20px"
      >
        <DrawerCloseButton />
        <DrawerHeader alignSelf="center">Comments</DrawerHeader>

        <DrawerBody>
          {
            comments.length > 0 ? (
              <Flex
                widht="100%"
                margin="auto"
                flexDirection="column"
                height="40vh"
              >
                {
                  comments.map((el) => (
                    <Box
                      key={el._id}
                      padding={{ base: '10px', sm: '20px' }}
                      border="1px solid #ccc"
                      mb="3"
                      borderRadius="md"
                    >
                      <Flex>
                        <Avatar name={el.user.name} src={el.user.profileImage} size="md" />
                        <Box ml="2">
                          <Flex>
                            <Text fontWeight="400">
                              @
                              {el.user.username}
                            </Text>
                            <Text fontWeight="samibold" color="var(--secondary-light-color)" ml={3}>
                              {dayjs(el.createdAt).fromNow()}
                            </Text>
                          </Flex>
                          <span style={{
                            fontWeight: 'bold', color: 'var(--secondary-light-text-color)',
                          }}
                          >
                            {isCommentExpanded(el._id) ? (
                              el.comment
                            ) : (
                              <>
                                {`${el.comment.substring(0, 40)}`}
                                { el.comment.length > 40 && '...' }
                                {el.comment.length > 40 && (
                                  <Text
                                    fontWeight="semibold"
                                    color="var(--primary-light-color)"
                                    cursor="pointer"
                                    onClick={() => handleCommentExpand(el._id)}
                                  >
                                    See More
                                  </Text>
                                )}
                              </>
                            )}
                          </span>
                          {isCommentExpanded(el._id) && (
                            <Text
                              fontWeight="semibold"
                              color="var(--primary-light-color)"
                              cursor="pointer"
                              onClick={() => handleCommentExpand(el._id)}
                            >
                              See Less
                            </Text>
                          )}
                        </Box>
                      </Flex>
                    </Box>
                  ))
                }
              </Flex>
            ) : (
              <Text fontWeight="semibold" textAlign="center" color="#9a9a9a">
                There is no comment on this post.
              </Text>
            )
          }
        </DrawerBody>
        <DrawerFooter>
          <Input
            placeholder="Aa"
            focusBorderColor="transparent"
            outline="none"
            _focus={{
              boxShadow: 'none',
            }}
            style={{
              border: 'none',
              borderRadius: '30px',
              backgroundColor: '#ccc',
            }}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            disabled={isLoading}
          />
          <Button
            bgColor="var(--primary-light-color)"
            borderRadius="30%"
            ml="10px"
            _hover={{
              bgColor: 'var(--primary-light-color)',
            }}
            onClick={createNewCommentHandler}
            isLoading={isLoading}
          >
            <CiPaperplane fill="white" fontSize="1.4rem" />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentModal;
