import React, { useRef, useState } from 'react';
import {
  Box, Button, ButtonGroup, Image, Spinner, Text, useToast,
} from '@chakra-ui/react';

import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import Cookies from 'js-cookie';
import sendHttpRequest from '../../sendHttpRequest';

const ProfileImageUploader = ({ showProfileUploader, setUserData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const inputRef = useRef(null);
  const uploadRef = useRef(null);
  const [show, setShow] = useState(false);
  const allowedExtensions = /(\.webp|\.png|\.jpg|\.jpeg)$/i;
  const [showSpinner, setShowSpinner] = useState(false);
  const toast = useToast();

  const publicKey = '<YOUR_IMAGEKIT_PUBLIC_KEY>';
  const urlEndpoint = 'https://ik.imagekit.io/<YOUR_IMAGEKIT_URL_ENDPOINT>';
  const authenticationEndpoint = 'http://localhost:3000/api/v1/auth/imagekit/signature';

  const onError = (err) => {
    console.log('Error', err);
  };

  const onSuccess = (res) => {
    setImageURL(res.url);
    setShow(false);
  };

  const onUploadStart = (fileInfo) => {
    setShow(true);
  };

  const handleChangeProfile = () => {
    setShowSpinner(true);
    sendHttpRequest(
      'PUT',
      '/user/update/profile',
      {
        'Content-Type': 'application/json',
        'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
      },
      {
        profileImage: imageURL,
      },
    ).then((res) => {
      setUserData(res.data.user);
      showProfileUploader(false);
      setShowSpinner(false);
      toast({
        title: 'Profile Updated!',
        status: 'success',
        isClosable: true,
      });
    })
      .catch((err) => {
        setShowSpinner(false);
      });
  };

  return (
    <>
      <Box
        width="100%"
        margin="auto"
        mt={20}
      >
        <Text fontSize="1xl" fontWeight="bold" mb="5">
          Profile Picture
        </Text>
      </Box>
      <Box
        width="100%"
        margin="auto"
        border="2px dashed #ccc"
        mb="5"
      >
        <IKContext
          publicKey={publicKey}
          urlEndpoint={urlEndpoint}
          authenticationEndpoint={authenticationEndpoint}
        >
          {
            (!show && !imageURL) && (
              <IKUpload
                fileName={selectedFile ? selectedFile.name : 'piclounge_post.webp'}
                tags={['post-image']}
                isPrivateFile={false}
                useUniqueFileName
                validateFile={(file) => {
                  const fileName = file.name.toLowerCase();
                  const fileSize = file.size;
                  return allowedExtensions.test(fileName) && fileSize < 2000000;
                }}
                folder="/profiles"
                onError={onError}
                onSuccess={onSuccess}
                onUploadStart={onUploadStart}
                ref={uploadRef}
                inputRef={inputRef}
                style={{
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '150px',
                  width: '100%',
                  borderRadius: '4px',
                  padding: '16px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              />
            )
          }

          {
            show && (
              <Spinner />
            )
          }

          {imageURL && (
            <Box
              width="100%"
              margin="auto"
            >
              <Image
                borderRadius="full"
                boxSize="120px"
                src={imageURL}
              />
            </Box>
          )}

        </IKContext>
      </Box>

      <ButtonGroup>
        <Button
          onClick={() => showProfileUploader(false)}
        >
          Cancel
        </Button>
        <Button
          bg="var(--primary-light-color)"
          color="white"
          _hover={{ bg: '#e7735c' }}
          onClick={handleChangeProfile}
        >
          {
            showSpinner ? (
              <Spinner />
            )
              : 'Change Profile'
          }
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ProfileImageUploader;
