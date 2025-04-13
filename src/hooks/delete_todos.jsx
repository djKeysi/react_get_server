import { useState } from 'react';
import { getTodos } from './get_todos';

export const deleteTodos = (setTodos) => {
	const [isDeleting, setisDeleting] = useState(false);
	const onClickDeleteTodos = (id) => {
		setisDeleting(true);
		fetch(`http://localhost:3005/todos/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				setTodos((prevTodos) => prevTodos.filter((todos) => todos.id !== id));
				getTodos(setTodos);
			})
			.finally(() => setisDeleting(false));
	};

	return { onClickDeleteTodos, isDeleting };
};
