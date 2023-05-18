/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  Input,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Image,
  Button,
  useToast,
} from '@chakra-ui/react';
import {
  CloseIcon,
  Search2Icon, SearchIcon,
} from '@chakra-ui/icons';
import Cookies from 'js-cookie';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { SiFacebook, SiWhatsapp } from 'react-icons/si';
import useDebounce from '../../hooks/useDebounce';
import sendHttpRequest from '../../sendHttpRequest';
import SearchUserCard from './SearchUserCard';

const SearchDrawer = ({ isSearchOpen, isSearchClose }) => {
  const btnRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const toast = useToast();

  const handleClearInput = () => {
    setSearchTerm('');
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchResults([]);
    setShowSkeletons(true);
  };

  const debounceSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debounceSearchTerm) {
      setShowNoResults(false);

      sendHttpRequest('GET', `/user/search/${debounceSearchTerm}`, {
        'Content-Type': 'application/json',
        'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
      }, null)
        .then((res) => {
          setSearchResults(res.data.users);
          setShowSkeletons(false);

          if (res.data.users.length === 0) {
            setShowNoResults(true);
          }
        });
    } else {
      setSearchResults([]);
      setShowNoResults(false);
      setShowSkeletons(false);
    }
  }, [debounceSearchTerm]);

  return (
    <Drawer
      isOpen={isSearchOpen}
      placement="right"
      onClose={isSearchClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton
          left={4}
        />

        <DrawerBody
          mt={10}
        >
          <Box>
            <Text
              fontSize="3xl"
              fontWeight="600"
              textAlign="left"
            >
              Search
            </Text>
          </Box>
          <Box
            mt={3}
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.700" />
              </InputLeftElement>
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
                focusBorderColor="#FA9884"
                border="1px solid #9c9c9c"
              />
              {searchTerm && (
                <InputRightElement>
                  <IconButton
                    aria-label="Clear input"
                    variant="ghost"
                    _hover={{ bg: 'transparent' }}
                    icon={<CloseIcon />}
                    onClick={handleClearInput}
                  />
                </InputRightElement>
              )}
            </InputGroup>
          </Box>
          <Box>
            <Text
              fontSize="2xl"
              fontWeight="600"
              textAlign="left"
              mt={10}
              mb={5}
            >
              Results
            </Text>
          </Box>
          {
            showNoResults && (
              <Box>
                <Text
                  fontSize="1xl"
                  fontWeight="600"
                  textAlign="center"
                  mt={10}
                >
                  No results found, Invite your friends to join Piclounge!

                </Text>
                <Flex gap="4" width="60%" m="auto" mt={5}>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      navigator.clipboard.writeText('https://piclounge.vercel.app');
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
                        window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent('https://piclounge.vercel.app')}`, '_blank');
                      } else {
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('https://piclounge.vercel.app')}`, '_blank');
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
                      window.open('https://www.facebook.com/sharer/sharer.php?u=https://piclounge.vercel.app', '_blank');
                    }}
                  >
                    <SiFacebook />
                  </Button>
                </Flex>
              </Box>
            )
          }
          {
            showSkeletons && (
              <Flex
                mt={2}
                flexDirection="column"
              >
                <Flex padding="2" mb={4} border="1px solid #ccc" borderRadius={10}>
                  <SkeletonCircle size="10" />
                  <SkeletonText noOfLines={2} skeletonHeight={4} w="60%" ml={3} />
                </Flex>
                <Flex padding="2" mb={4} border="1px solid #ccc" borderRadius={10}>
                  <SkeletonCircle size="10" />
                  <SkeletonText noOfLines={2} skeletonHeight={4} w="60%" ml={3} />
                </Flex>
                <Flex padding="2" mb={4} border="1px solid #ccc" borderRadius={10}>
                  <SkeletonCircle size="10" />
                  <SkeletonText noOfLines={2} skeletonHeight={4} w="60%" ml={3} />
                </Flex>
                <Flex padding="2" mb={4} border="1px solid #ccc" borderRadius={10}>
                  <SkeletonCircle size="10" />
                  <SkeletonText noOfLines={2} skeletonHeight={4} w="60%" ml={3} />
                </Flex>
                <Flex padding="2" mb={4} border="1px solid #ccc" borderRadius={10}>
                  <SkeletonCircle size="10" />
                  <SkeletonText noOfLines={2} skeletonHeight={4} w="60%" ml={3} />
                </Flex>
              </Flex>
            )
          }

          {
            searchResults.length > 0 && (
              searchResults.map((user) => (
                <SearchUserCard
                  key={user._id}
                  profileImage={user.profileImage}
                  username={user.username}
                  name={user.name}
                  _id={user._id}
                  onClose={isSearchClose}
                />
              ))
            )
          }
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
