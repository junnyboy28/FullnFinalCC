import { Box, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();

	// Color mode values
	const bgColor = useColorModeValue("copper.100", "purple.800");
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const spinnerColor = useColorModeValue("copper.500", "purple.500");

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<Flex gap='10' alignItems={"flex-start"}>
			<Box flex={70} bg={bgColor} p={4} borderRadius="md">
				{!loading && posts.length === 0 && (
					<Text color={textColor} fontSize="xl" fontWeight="bold">
						Follow some users to see the feed
					</Text>
				)}

				{loading && (
					<Flex justify='center'>
						<Spinner size='xl' color={spinnerColor} />
					</Flex>
				)}

				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>
			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
				bg={bgColor}
				p={4}
				borderRadius="md"
			>
				<SuggestedUsers />
			</Box>
		</Flex>
	);
};

export default HomePage;
