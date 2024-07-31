import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import {
	Box,
	Button,
	ButtonGroup,
	Card,
	CardMedia,
	Typography,
} from "@mui/material";
import { useTimeout } from "src/utils";

interface Props {
	contentUrl: string;
}

interface Content {
	imageUrl: string;
	label: string;
	url: string;
	subLabel: string;
}

export default
function AdLinkSection(props: Props) {
	const { contentUrl } = props;
	const [content, setContent] = useState<Content[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [revealed, setRevealed] = useState(false);
	const handleTimeout = useCallback(() => {
		if(!content.length || revealed) {
			return;
		}

		console.log(content.length, revealed);

		setRevealed(true);
		setIsOpen(true);
	}, [content, revealed]);

	useTimeout(handleTimeout, 15_000);

	useEffect(() => {
		fetch(contentUrl)
			.then(response => response.json())
			.then(setContent);
	}, []);

	if(!content.length) {
		return null;
	}

	const activeItem = content[activeIndex] as Content;

	return (
		<Box
			position="fixed"
			left="50%"
			bottom={0}
			zIndex={10}
			maxHeight={isOpen ? 100 : 0}
			sx={{
				transform: "translateX(-50%)",
				transition: "max-height 1s ease-in-out",
			}}
		>
			<Box
				position="absolute"
				top={0}
				right={0}
				zIndex={-1}
				sx={{
					translate: "0  -75%",
					cursor: 'pointer',
				}}
			>
				<Button
					variant="contained"
					sx={{
						borderBottomWidth: 0,
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
					}}
					onClick={() => {
						setRevealed(true);
						setIsOpen(!isOpen);
					}}
				>
					{isOpen ?
						<ExpandMore /> :
						<ExpandLess />
					}
				</Button>
			</Box>
			<Card sx={{
				borderRadius: 0,
				width: 450,
				maxWidth: '100vw',
			}}>
				<Box display="flex" >
					<Box display="flex">
						<ButtonGroup variant="text" size="small">
							<Button
								size="small"
								sx={{ borderWidth: 0 }}
								onClick={decrementIndex}
							>
								<ChevronLeft />
							</Button>
							<Button
								size="small"
								sx={{ borderWidth: 0 }}
								onClick={incrementIndex}
							>
								<ChevronRight />
							</Button>
						</ButtonGroup>
					</Box>
					<Box
						component="a"
						href={activeItem.url}
						target="_blank"
						display="flex"
						justifyContent="center"
						alignContent="center"
						flex="auto"
					>
						<CardMedia
							component="img"
							image={activeItem.imageUrl}
							sx={{
								maxWidth: 80,
								maxHeight: 80,
								objectFit: "contain",
							}}
						/>
					</Box>
					<Box
						component="a"
						display="flex"
						alignContent="center"
						justifyContent="center"
						href={activeItem.url}
						target="_blank"
						sx={{
							all: 'unset',
							cursor: 'pointer',
						}}
					>
						<Box
							padding={2}
							display="flex"
							flexDirection="column"
							textAlign="center"
						>
							<Typography variant="subtitle1">
								{activeItem.label}
							</Typography>
							<Typography variant="subtitle2">
								{activeItem.subLabel}
							</Typography>
						</Box>
					</Box>
				</Box>
			</Card>
		</Box>
	);

	function incrementIndex() {
		setActiveIndex(
			(activeIndex + 1) % content.length
		);
	}

	function decrementIndex() {
		setActiveIndex(
			(activeIndex - 1 + content.length) % content.length
		);
	}
}
