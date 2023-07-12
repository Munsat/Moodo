import {
  Avatar,
  Badge,
  Box,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  IconButton,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

import { format, formatDistance } from "date-fns";
import { useAuth } from "../../contexts/AuthProvider";
import {
  deletePost,
  queryAllComments,
  updatePostLike,
} from "../../FirestoreQueries";
import PostDetails from "./PostDetails";
import { useEffect, useRef, useState } from "react";

const Post = ({ post, setPosts, posts }) => {
  const finalRef = useRef(null);
  const toast = useToast();

  const [isPostDetailsOpen, setIsPostDetailsOpen] = useState(false);
  const { user } = useAuth();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getQuery = async () => {
      const queryArr = [];

      try {
        const queryRes = await queryAllComments(post.id);
        queryRes.forEach((snap) => {
          const data = { id: snap.id, ...snap.data() };
          queryArr.push(data);
        });
        setComments(queryArr);
      } catch (err) {
        console.error(err);
      }
    };
    getQuery();
  }, []);

  //Updates Like/Unlike on a post
  const handleLike = async (postToLike) => {
    try {
      await updatePostLike(postToLike, user.uid);
      if (!postToLike.likes.includes(user.uid)) {
        setPosts((prevPosts) =>
          prevPosts.map((prevPost) =>
            prevPost.id === postToLike.id
              ? { ...prevPost, likes: [...prevPost.likes, user.uid] }
              : prevPost
          )
        );
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((prevPost) =>
            prevPost.id === postToLike.id
              ? {
                  ...prevPost,
                  likes: prevPost.likes.filter((userId) => userId !== user.uid),
                }
              : prevPost
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  //Deletes a post
  const handlePostDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
      toast({
        title: "Post Deleted!",
        description: "Your post has been deleted from the discussion board.",
        status: "warning",
        position: "bottom-right",
        duration: 9000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card
      bg="themeColor.pastel"
      opacity=".85"
      variant="elevated"
      borderRadius="3rem"
      key={post.id}
      width={{ base: "100%", lg: "40%", xl: "30%" }}
      minW="20rem"
      minH="18rem"
    //   maxW='30rem'
      textAlign="start"
      _hover={{ cursor: "pointer", backgroundColor: "themeColor.darkPastel" }}
      alignSelf="start"
    >
      <PostDetails
        finalRef={finalRef}
        isOpen={isPostDetailsOpen}
        onClose={() => setIsPostDetailsOpen(false)}
        handleLike={handleLike}
        handlePostDelete={handlePostDelete}
        post={post}
        user={user}
        comments={comments}
        setComments={setComments}
      />
      <CardBody
        w="100%"
        px="3rem"
        pt="3rem"
        pb="0"
        onClick={() => setIsPostDetailsOpen(true)}
      >
        <HStack display={{ xl: "flex" }} maxW="100%">
          <Avatar name={post.username} bg="orange.300" size="md" />
          <Heading fontSize="lg">{post.username}</Heading>
          <Badge colorScheme="yellow" variant="outline">
            {formatDistance(Date.now(), post.created_on)} ago
          </Badge>
        </HStack>
        <Text
          mt={5}
          fontSize="md"
          minH="4rem"
          overflow="hidden"
          textOverflow="ellipsis"
          css={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.text}
          {format(post.created_on, "yyyy-MM-dd") ===
          format(post.updated_on, "yyyy-MM-dd") ? (
            <></>
          ) : (
            <Tooltip label={formatDistance(Date.now(), post.updated_on)}>
              <Badge size="xs" variant="outline" colorScheme="orange" ml={3}>
                Edited
              </Badge>
            </Tooltip>
          )}
        </Text>
      </CardBody>
      <CardFooter pt="0" pb="2rem">
        <ButtonGroup>
          <Box>
            <IconButton
              icon={<AiFillHeart />}
              bg="transparent"
              fontSize="1.6rem"
              color="themeColor.red"
              _hover={{ bg: "transparent", color: "red.600" }}
              onClick={() => handleLike(post)}
            />
            <Badge fontSize="1rem" bg="transparent">
              {post.likes.length}
            </Badge>
          </Box>
          <Box>
            <IconButton
              icon={<FaComment />}
              bg="transparent"
              fontSize="1.6rem"
              color="themeColor.yellow"
              _hover={{ bg: "transparent", color: "yellow.500" }}
              onClick={() => setIsPostDetailsOpen(true)}
            />
            <Badge fontSize="1rem" bg="transparent">
              {comments.filter((comment) => comment.postId === post.id).length}
            </Badge>
          </Box>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default Post;
