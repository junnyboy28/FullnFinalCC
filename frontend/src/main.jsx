import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/theme-utils";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketContext.jsx";

const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "whiteAlpha.900")(props),
			bg: mode("#E1C4A9", "#4A0E4E")(props),
		},
	}),
};

const config = {
	initialColorMode: "light",  // Changed from "dark" to "light"
	useSystemColorMode: true,
};

const colors = {
	copper: {
		50: "#FDF5EF",
		100: "#F9E5D5",
		200: "#F3D0B5",
		300: "#E1C4A9",
		400: "#D2A77D",
		500: "#C28B5B",
		600: "#A16B3F",
		700: "#815431",
		800: "#613E24",
		900: "#422A18",
	},
	purple: {
		50: "#F5E6FF",
		100: "#E1BFFF",
		200: "#CD99FF",
		300: "#B973FF",
		400: "#A54DFF",
		500: "#9127FF",
		600: "#7A00E6",
		700: "#6200B3",
		800: "#4A0E4E",
		900: "#320A33",
	},
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<ChakraProvider theme={theme}>
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					<SocketContextProvider>
						<App />
					</SocketContextProvider>
				</ChakraProvider>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>
);
