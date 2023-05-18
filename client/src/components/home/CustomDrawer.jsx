import React, { useRef, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import ImageUploader from './ImageUploader';
import sendHttpRequest from '../../sendHttpRequest';

const CustomDrawer = ({ isOpen, onClose }) => {
  const btnRef = useRef();
  const [imageURL, setImageURL] = useState(null);
  const [caption, setCaption] = useState('');
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);
  const toast = useToast();

  const handleCreatePost = () => {
    setIsRequestProcessing(true);
    if (imageURL === null || caption === '') {
      toast({
        title: 'Image and caption are required!',
        status: 'error',
        isClosable: true,
      });
    } else {
      sendHttpRequest(
        'POST',
        '/post/create',
        {
          'Content-Type': 'application/json',
          'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
        },
        {
          image: imageURL,
          caption,
        },
      ).then((res) => {
        toast({
          title: 'Post created!',
          status: 'success',
          isClosable: true,
        });
        setIsRequestProcessing(false);
        onClose();
        setImageURL(null);
        setCaption('');
        window.location.reload();
      }).catch((err) => {
        setIsRequestProcessing(false);
        toast({
          title: err.message,
          status: 'error',
          isClosable: true,
        });
      });
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent
        borderTopRightRadius="20px"
        borderTopLeftRadius="20px"
      >
        <DrawerCloseButton />
        <DrawerHeader>Create new post</DrawerHeader>

        <DrawerBody>
          <ImageUploader imageURL={imageURL} setImageURL={setImageURL} />

          <Text fontSize="1xl" fontWeight="bold" mt={10} mb={2}>
            Caption:
          </Text>
          <Input
            placeholder="hey there this is my new post!✌️"
            focusBorderColor="#FA9884"
            value={caption}
            name="caption"
            onChange={(e) => setCaption(e.target.value)}
            required
          />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            bg="var(--primary-light-color)"
            color="white"
            onClick={handleCreatePost}
            isLoading={isRequestProcessing}
            _hover={{ bg: '#FC8181', color: 'white' }}
          >
            Post

          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
