import { useState } from 'react';

export const getTodos = (setTodos) => {
	//const [isLoading, setIsLoading] = useState(false);
	//const [todos, setTodos] = useState([]);
	//	setIsLoading(true);
	fetch('http://localhost:3005/todos')
		.then((response) => response.json())
		.then((data) => {
			setTodos(data);
		});
	//.finally(() => setIsLoading(false));

	// return {
	// 	isLoading,
	// 	todos,
	// };
};
