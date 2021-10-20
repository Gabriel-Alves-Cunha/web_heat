import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { FormEvent, useState } from "react";

import { useAuthContext } from "../../contexts/auth";

import styles from "./styles.module.scss";
import { api } from "../../services/api";

export function SendMessageForm() {
	const { user, signout } = useAuthContext();

	const [msg, setMsg] = useState("");

	async function handleSendMsg(e: FormEvent) {
		e.preventDefault();

		if (!msg.trim()) return;

		await api.post("/messages", { message: msg });

		setMsg("");
	}

	return (
		<div className={styles.wrapper}>
			<button onClick={signout} className={styles.signoutButton}>
				<VscSignOut size="32" />
			</button>

			<header className={styles.userInfo}>
				<div className={styles.userImg}>
					<img src={user?.avatar_url} alt={user?.name} />
				</div>

				<strong className={styles.userName}>{user?.name}</strong>

				<span className={styles.userGithub}>
					<VscGithubInverted size="16" /> {user?.login}
				</span>
			</header>

			<form onSubmit={handleSendMsg} className={styles.form}>
				<label htmlFor="message">Mensagem</label>
				<textarea
					name="message"
					id="message"
					placeholder="Qual sua expectativa para o evento?"
					onChange={e => setMsg(e.target.value)}
					value={msg}
				></textarea>

				<button type="submit">Enviar mensagem</button>
			</form>
		</div>
	);
}
