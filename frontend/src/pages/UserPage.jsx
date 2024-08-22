import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);

	// Color mode values
	const bgColor = useColorModeValue("copper.100", "purple.800");
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const spinnerColor = useColorModeValue("copper.500", "purple.500");

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"} alignItems={"center"} height={"100vh"} bg={bgColor}>
				<Spinner size={"xl"} color={spinnerColor} />
			</Flex>
		);
	}

	if (!user && !loading) return (
		<Flex justifyContent={"center"} alignItems={"center"} height={"100vh"} bg={bgColor}>
			<Text fontSize="2xl" fontWeight="bold" color={textColor}>User not found</Text>
		</Flex>
	);

	return (
		<VStack spacing={4} align="stretch" bg={bgColor} minH="100vh" p={4}>
			<UserHeader user={user} />

			{!fetchingPosts && posts.length === 0 && (
				<Text fontSize="xl" fontWeight="bold" color={textColor} textAlign="center" mt={8}>
					User has no posts.
				</Text>
			)}
			
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} color={spinnerColor} />
				</Flex>
			)}

			{posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</VStack>
	);
};

export default UserPage;
