import axios from "axios";

const PORT = 4000 as const;

export const api = axios.create({
	baseURL: `http://localhost:${PORT}`,
});
