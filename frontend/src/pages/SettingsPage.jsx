import { Button, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();

	// Color mode values
	const bgColor = useColorModeValue("copper.100", "purple.800");
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const buttonBgColor = useColorModeValue("copper.500", "purple.500");
	const buttonHoverBgColor = useColorModeValue("copper.600", "purple.600");

	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?")) return;

		try {
			const res = await fetch("/api/users/freeze", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();

			if (data.error) {
				return showToast("Error", data.error, "error");
			}
			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<VStack align="start" spacing={4} bg={bgColor} p={6} borderRadius="md" width="100%">
			<Text fontWeight={"bold"} fontSize="xl" color={textColor}>
				Freeze Your Account
			</Text>
			<Text color={textColor}>
				You can unfreeze your account anytime by logging in.
			</Text>
			<Button 
				size={"sm"} 
				bg={buttonBgColor}
				color="white"
				_hover={{ bg: buttonHoverBgColor }}
				onClick={freezeAccount}
			>
				Freeze
			</Button>
		</VStack>
	);
};
