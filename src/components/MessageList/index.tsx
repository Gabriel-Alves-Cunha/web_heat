import { useEffect, useState } from "react";
import io from "socket.io-client";

import { api } from "../../services/api";

import logoImg from "../../assets/logo.svg";
import styles from "./styles.module.scss";

interface Message {
	id: string;
	text: string;
	user: {
		name: string;
		avatar_url: string;
	};
}

const msgsQueue: Message[] = [];

const socketUrl = "http://localhost:4000";
const socket = io(socketUrl);

socket.on("new_message", newMsg => msgsQueue.push(newMsg));

export function MessageList() {
	const [msgs, setMsgs] = useState([] as Message[]);

	useEffect(() => {
		api.get<Message[]>("/messages/last3").then(res => setMsgs(res.data));
	}, []);

	useEffect(() => {
		setInterval(() => {
			if (msgsQueue.length > 0) {
				setMsgs(oldMsgs => {
					console.log([msgsQueue[0], oldMsgs[0], oldMsgs[1]].filter(Boolean));
					return [msgsQueue[0], oldMsgs[0], oldMsgs[1]].filter(Boolean);
				});

				msgsQueue.shift(); // rm 1º item
			}
		}, 3_000);
	}, []);

	console.log(msgs);

	return (
		<div className={styles.wrapper}>
			<img src={logoImg} alt="Logo da DoWhile 2021" />

			<ul className={styles.msgList}>
				{msgs.map(msg => (
					<li className={styles.msg} key={msg.id}>
						<p className={styles.msgContent}>{msg.text}</p>
						{console.log(msg)}
						<div className={styles.msgUser}>
							<div className={styles.userImg}>
								<img src={msg.user.avatar_url} alt={msg.user.name} />
							</div>

							<span>{msg.user.name}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
