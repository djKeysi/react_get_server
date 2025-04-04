export const updateTodos = (setTodos, checked, valueChecked, valueInputUpdate) => {
	const onClickUpdateTodos = () => {
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
				.catch((err) => console.log(err));
		}
	};
	return {
		onClickUpdateTodos,
	};
};
