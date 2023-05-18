import {
  Box, Flex, Image, Text,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchUserCard = ({
  profileImage, username, name, _id, onClose,
}) => {
  const navigate = useNavigate();

  return (
    <Flex
      padding="2"
      mb={4}
      border="1px solid #ccc"
      borderRadius={10}
      _hover={{ bg: '#f8f9fa' }}
      cursor="pointer"
      onClick={() => { navigate(`/profile/${_id}`); onClose(); }}
    >
      <Box
        width="20%"
      >
        <Image
          src={profileImage}
          alt="profile"
          borderRadius={50}
          boxSize="50px"
        />
      </Box>
      <Box
        width="60%"
        ml={2}
      >
        <Text
          fontSize="1xl"
          fontWeight="600"
          textAlign="left"
        >
          {username}
        </Text>
        <Text
          fontSize="1xl"
          fontWeight="400"
          textAlign="left"
        >
          {name}
        </Text>
      </Box>
    </Flex>
  );
};
export default SearchUserCard;
