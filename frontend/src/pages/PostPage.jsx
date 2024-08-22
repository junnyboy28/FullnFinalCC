import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";
import { useSocket } from "../context/SocketContext.jsx";

const PostPage = () => {
	const { socket } = useSocket();
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const [reply, setReply] = useState("");

	// Color mode values
	const bgColor = useColorModeValue("copper.100", "purple.800");
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const borderColor = useColorModeValue("copper.300", "purple.600");
	const buttonBgColor = useColorModeValue("copper.300", "purple.500");
	const buttonHoverBgColor = useColorModeValue("copper.400", "purple.600");

	const currentPost = posts[0];

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

    const handleReply = async () => {
        if (!currentUser) return showToast("Error", "You must be logged in to reply", "error");
        if (!reply.trim()) return;

        try {
            const res = await fetch(`/api/posts/${currentPost._id}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: reply }),
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            socket.emit("newComment", { postId: currentPost._id, comment: data });

            setReply("");
            // Update UI logic here
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} color={useColorModeValue("copper.500", "purple.500")} />
			</Flex>
		);
	}

	if (!currentPost) return null;

	return (
		<Box bg={bgColor} p={4} borderRadius="md">
			<Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={user.profilePic} size={"md"} name='Mark Zuckerberg' />
					<Flex>
						<Text fontSize={"sm"} fontWeight={"bold"} color={textColor}>
							{user.username}
						</Text>
						<Image src='/verified.png' w='4' h={4} ml={4} />
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text fontSize={"xs"} width={36} textAlign={"right"} color={useColorModeValue("gray.600", "gray.400")}>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>

					{currentUser?._id === user._id && (
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} color={textColor} />
					)}
				</Flex>
			</Flex>

			<Text my={3} color={textColor}>{currentPost.text}</Text>

			{currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={borderColor}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4} borderColor={borderColor} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={useColorModeValue("gray.600", "gray.400")}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button bg={buttonBgColor} _hover={{ bg: buttonHoverBgColor }} color={textColor}>Get</Button>
			</Flex>

			<Divider my={4} borderColor={borderColor} />
			{currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
				/>
			))}
		</Box>
	);
};

export default PostPage;
