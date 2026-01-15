// import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import "../style.css"
import { UserAvatar } from "../components/UserAvatar.tsx";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export type navbarViewProps = {
	username: string | null;
	userId: string;
	sessionId: string | null;
	onLogoClick: () => void;
	onSignOutClick: () => void;
	onExitSession: () => void;
}


export function NavbarView(props: navbarViewProps) {
	const [isMobileNavbar, setIsMobileNavbar] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	function logoClickACB() {
		props.onLogoClick();
	}

	function signOutClickACB() {
		props.onSignOutClick();
	}

	function exitSessionACB() {
		props.onExitSession();
	}

	const sessionActive = !!props.sessionId;

	function profileClickACB() {
		window.location.hash = "#/profile";
	}
	function toggleNavBarACB() {
		if (!isMobileNavbar) return;
		if (isOpen) { setIsOpen(false) }
		else { setIsOpen(true) };
	}


	useEffect(() => {
	  const mq = window.matchMedia('(max-width: 700px)');

	  const sync = (matches: boolean) => {
			if (matches) {
				
			}
			setIsMobileNavbar(matches); // mobile => false, desktop => true
	  };
		const onChange = (e: MediaQueryListEvent) => {
			sync(e.matches);
	  };

	  // initial sync
	  sync(mq.matches);

	  mq.addEventListener('change', onChange);
	  return () => mq.removeEventListener('change', onChange);
	}, []);

	const isOpenClassName = isMobileNavbar && isOpen ? "header-is-open" : "";

	return (
		<div className={`header ${isOpenClassName}`}>
			<h1 onClick={logoClickACB} className="logo-text">
				CineMatch
			</h1>
			<button className={`header-toggle ${isOpenClassName}`} onClick={toggleNavBarACB}>
				{isOpen ? <FaArrowUp/> : <FaArrowDown/>}
			</button>
			{
				props.username ? (
					<>
						<div>
							{sessionActive ?
								<button className="secondary-button" onClick={exitSessionACB}>
									Exit Session
								</button>
								: ""
							}
							<button className="secondary-button" onClick={signOutClickACB}>Log Out</button>
						</div>
						<IconButton className="profile-button" onClick={profileClickACB}>
							<p className="username">{props.username}</p>
							{props.userId ? <UserAvatar
								userId={props.userId}
								className="profile-pic navbar"
								size={60}
							/>
								:
								<FaUserCircle size={60} className="profile-pic placeholder" />
							}
						</IconButton>
					</>
				) : (
					<div>
						{sessionActive ?
							<button className="secondary-button" onClick={exitSessionACB}>
								Exit Session
							</button>
							: ""
						}
						{/* <button className="secondary-button" onClick={() => { window.location.hash = "#/account" }}>
							Log In
						</button> */}
					</div>
				)
			}
		</div>
	);
}
