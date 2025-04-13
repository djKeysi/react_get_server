import { useState } from 'react';

export const addTodos = (setTodos, valueInput) => {
	const [isCreating, setIsCreating] = useState(false);
	const onClickAddTodos = () => {
		setIsCreating(true);
		fetch('http://localhost:3005/todos/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
			body: JSON.stringify({ title: valueInput }),
		})
			.then((res) => res.json())
			.then((json) => {
				if (valueInput !== '') {
					setTodos((prevTodos) => [...prevTodos, json]);
				}
			})
			.finally(() => setIsCreating(false));
	};

	return {
		onClickAddTodos,
		isCreating,
	};
};
