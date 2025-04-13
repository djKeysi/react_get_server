import { getTodos } from './get_todos';

export const deleteTodos = (setTodos) => {
	const onClickDeleteTodos = (id) => {
		fetch(`http://localhost:3005/todos/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				setTodos((prevTodos) => prevTodos.filter((todos) => todos.id !== id));
				getTodos(setTodos);
			})
			.catch((err) => console.log(err));
	};

	return { onClickDeleteTodos };
};
