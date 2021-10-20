import { VscGithubInverted } from "react-icons/vsc";
import { useAuthContext } from "../../contexts/auth";

import styles from "./styles.module.scss";

export function LoginBox() {
	const { signinUrl } = useAuthContext();

	return (
		<div className={styles.wrapper}>
			<strong>Entre e compartilhe sua mensagem</strong>
			<a href={signinUrl} className={styles.siginWithGithub}>
				<VscGithubInverted size="24" />
				Entrar com Github
			</a>
		</div>
	);
}
