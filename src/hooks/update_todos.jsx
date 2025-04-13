import { useState } from 'react';

export const updateTodos = (setTodos, checked, valueChecked, valueInputUpdate) => {
	const [isUpdating, setisUpdating] = useState(false);
	const onClickUpdateTodos = () => {
		setisUpdating(true);

		if (checked) {
			fetch(`http://localhost:3005/todos/${valueChecked}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json; charset=UTF-8' },
				body: JSON.stringify({ title: valueInputUpdate }),
			})
				.then((res) => res.json())
				.then((updatedTodos) => {
					setTodos((prevTodos) =>
						prevTodos.map((todos) =>
							todos.id === updatedTodos.id ? updatedTodos : todos,
						),
					);
				})
				.finally(() => setisUpdating(false));
		}
	};
	return {
		onClickUpdateTodos,
		isUpdating,
	};
};
