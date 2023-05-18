import React, { useRef, useState } from 'react';
import {
  Box, Image, Spinner, Text,
} from '@chakra-ui/react';

import { IKContext, IKImage, IKUpload } from 'imagekitio-react';

const ImageUploader = ({ imageURL, setImageURL }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const uploadRef = useRef(null);
  const [show, setShow] = useState(false);
  const allowedExtensions = /(\.webp|\.png|\.jpg|\.jpeg)$/i;


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

  return (
    <Box
      width="50%"
      margin="auto"
      border="2px dashed #ccc"
      mb="20"
    >
      <Text fontSize="1xl">
        select image
      </Text>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticationEndpoint={authenticationEndpoint}
      >
        {
          (!show && !imageURL) && (
            <IKUpload
              required
              fileName={selectedFile ? selectedFile.name : 'piclounge_post.webp'}
              tags={['post-image']}
              isPrivateFile={false}
              useUniqueFileName
              validateFile={(file) => {
                const fileName = file.name.toLowerCase();
                const fileSize = file.size;
                return allowedExtensions.test(fileName) && fileSize < 2000000;
              }}
              folder="/posts"
              onError={onError}
              onSuccess={onSuccess}
              // onUploadProgress={onUploadProgress}
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
          <div style={{
            width: '150px',
            margin: 'auto',
            marginBottom: '20px',
            maxWidth: '500px',
            maxHeight: '500px',
          }}
          >
            <img src={imageURL} alt="post" width="100%" />
          </div>
        )}

      </IKContext>
    </Box>
  );
};

export default ImageUploader;
