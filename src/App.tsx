import { MessageList } from "./components/MessageList";
import { LoginBox } from "./components/LoginBox";

import styles from "./App.module.scss";
import { useAuthContext } from "./contexts/auth";
import { SendMessageForm } from "./components/SendMessageForm";

export function App() {
	const { user } = useAuthContext();

	return (
		<main className={`${styles.wrapper} ${!!user ? styles.contentSigned : ""}`}>
			<MessageList />
			{!!user ? <SendMessageForm /> : <LoginBox />}
		</main>
	);
}
