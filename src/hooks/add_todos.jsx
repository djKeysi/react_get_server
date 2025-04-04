export const addTodos = (setTodos, valueInput) => {
	const onClickAddTodos = () => {
		fetch('http://localhost:3005/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
			body: JSON.stringify({ title: valueInput }),
		})
			.then((res) => res.json())
			.then((json) => {
				setTodos((prevTodos) => [...prevTodos, json]);
			})
			.catch((err) => console.log(err));
	};

	return {
		onClickAddTodos,
	};
};
