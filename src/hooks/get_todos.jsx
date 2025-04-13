import { useState } from 'react';

export const getTodos = (setTodos, isLoading) => {
	//	const [isLoading, setIsLoading] = useState(false);
	//setIsLoading(true);

	fetch('http://localhost:3005/todos')
		.then((response) => response.json())
		.then((data) => {
			isLoading = true;
			setTodos(data);
		})
		.finally(() => !isLoading);

	// return {
	// 	isLoading,
	// };
};
