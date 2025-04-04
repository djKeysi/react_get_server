export const getTodos = (setTodos) => {
	fetch('http://localhost:3005/todos')
		.then((response) => response.json())
		.then((data) => {
			setTodos(data);
		});
};
