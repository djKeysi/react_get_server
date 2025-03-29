import { useEffect, useState } from 'react';
import styles from './app.module.css';

export const App = () => {
	const [todosPlaceholder, setTodosPlaceholder] = useState([]);

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((response) => response.json())
			.then((json) => setTodosPlaceholder(json))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className={styles.app}>
			<h1>JSON Todos PlaceHolder</h1>
			<ul className={styles.older}>
				{todosPlaceholder.map(({ id, title }) => (
					<li key={id}>{title}</li>
				))}
			</ul>
		</div>
	);
};
