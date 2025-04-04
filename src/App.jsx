import { useState, useEffect } from 'react';
import styles from './app.module.css';
import { InputTodos } from './InputTodos/InputTodos';
import { ButtonTodos } from './ButtonTodos/ButtonTodos';
import { addTodos } from './hooks/add_todos';
import { updateTodos } from './hooks/update_todos';
import { deleteTodos } from './hooks/delete_todos';
import { getTodos } from './hooks/get_todos';
//npx json-server@0.17.4 --watch src/db.json --port 3005
export const App = () => {
	const [todos, setTodos] = useState([]);

	const [checked, setChecked] = useState(false);
	const [valueChecked, setValueChecked] = useState('');

	const [valueInput, setValueInput] = useState('');
	const [valueInputUpdate, setValueInputUpdate] = useState('');

	let [valueInputSearch, setValueInputSearch] = useState('');

	useEffect(() => {
		getTodos(setTodos);
	}, []);

	const { onClickAddTodos } = addTodos(setTodos, valueInput);

	const { onClickUpdateTodos } = updateTodos(
		setTodos,
		checked,
		valueChecked,
		valueInputUpdate,
	);
	const { onClickDeleteTodos } = deleteTodos(setTodos);

	const inputSearchTodos = (e) => {
		valueInputSearch = e.target.value; // иначе будет первая строка при вводе пустая
		setValueInputSearch(valueInputSearch);

		const search = todos.filter((item) => {
			return item.title
				.toLowerCase()
				.trim()
				.includes(valueInputSearch.toLowerCase());
		});
		setTodos(search);
		if (valueInputSearch === '') {
			getTodos(setTodos);
		}
	};

	const onClickSortTodos = (e) => {
		fetch('http://localhost:3005/todos')
			.then((res) => res.json())
			.then((data) => {
				//console.log(e.target.innerHTML);

				if (e.target.innerHTML === 'Сортировка по алфавиту') {
					data.sort((a, b) => a.title.localeCompare(b.title));
					setTodos(data);
					e.target.innerHTML = 'Вернуть сортировку';
				} else {
					data.sort((a, b) => b.title.localeCompare(a.title));
					setTodos(data);
					e.target.innerHTML = 'Сортировка по алфавиту';
				}
			});
	};

	return (
		<div className={styles.app}>
			<h1>JSON Todos SERVER</h1>

			<div>
				<InputTodos
					placeholder="Введите название задачи..."
					value={valueInput}
					onChange={(e) => setValueInput(e.target.value)}
				/>

				<ButtonTodos onClick={onClickAddTodos}>Добавить задачу</ButtonTodos>
			</div>
			<div>
				<InputTodos
					disabled={!checked}
					placeholder="На что изменяем?"
					value={valueInputUpdate}
					onChange={(e) => setValueInputUpdate(e.target.value)}
				/>
				<ButtonTodos onClick={onClickUpdateTodos}>Изменить задачу</ButtonTodos>
			</div>
			<div>
				<InputTodos
					//disabled={!checked}
					placeholder="Введите слово для поиска"
					value={valueInputSearch}
					onChange={inputSearchTodos}
				/>
			</div>
			<div>
				{' '}
				<ButtonTodos onClick={onClickSortTodos}>
					Сортировка по алфавиту
				</ButtonTodos>
			</div>

			<ul className={styles.older}>
				{todos.map(({ id, title }) => (
					<li key={id} onClick={() => setValueChecked(id)}>
						{title}{' '}
						<InputTodos
							type="checkbox"
							onChange={() => setChecked(!checked)}
							value={checked}
						/>
						<ButtonTodos onClick={() => onClickDeleteTodos(id)}>
							Удалить задачу
						</ButtonTodos>
					</li>
				))}
			</ul>
		</div>
	);
};
