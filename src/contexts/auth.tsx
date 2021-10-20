import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { api } from "../services/api";

const AuthContext = createContext({} as AuthContextData);

type User = {
	id: string;
	name: string;
	login: string;
	avatar_url: string;
};

type AuthContextData = {
	user: User | null;
	signinUrl: string;
	signout(): void;
};

type Props = {
	children: ReactNode;
};

interface AuthResponse {
	token: string;
	user: {
		id: string;
		avatar_url: string;
		name: string;
		login: string;
	};
}

const localStorageToken = "@dowhile:token" as const;
const githubClientId = "914190c5286e4ecc3d5c" as const;

export function AuthProvider({ children }: Props) {
	const [user, setUser] = useState<User | null>(null);

	const signinUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${githubClientId}`;

	async function signin(githubCode: string) {
		const {
			data: { token, user },
		} = await api.post<AuthResponse>("/authenticate", {
			code: githubCode,
		});

		localStorage.setItem(localStorageToken, token);

		api.defaults.headers.common.authorization = `Bearer ${token}`;

		setUser(user);
	}

	useEffect(() => {
		const url = window.location.href;
		const hasGithubCode = url.includes("?code=");

		if (hasGithubCode) {
			const [urlWithoutCode, githubCode] = url.split("?code=");

			window.history.pushState({}, "", urlWithoutCode);

			signin(githubCode);
		}
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("");

		if (token) {
			api.defaults.headers.common.authorization = `Bearer ${token}`;

			api.get<User>("/profile").then(res => setUser(res.data));
		}
	}, []);

	function signout() {
		setUser(null);
		localStorage.removeItem(localStorageToken);
		api.defaults.headers.common.authorization = `Bearer `;
	}

	return (
		<AuthContext.Provider value={{ user, signinUrl, signout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const ctx = useContext(AuthContext);

	return ctx;
}
