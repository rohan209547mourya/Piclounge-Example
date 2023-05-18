import {
  Box,
  Skeleton, SkeletonCircle, SkeletonText,
} from '@chakra-ui/react';
import React from 'react';

const PostCardSkeleton = () => (
  <Box p={5} maxW="md" boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">
    <SkeletonCircle size="12" />
    <SkeletonText mt="4" noOfLines={2} spacing="4" />
    <Skeleton height="200px" mt={5} />
  </Box>
);

export default PostCardSkeleton;
