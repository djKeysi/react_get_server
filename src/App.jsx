import { useState, useEffect } from 'react';
import styles from './app.module.css';
import { InputTodos } from './InputTodos/InputTodos';
import { ButtonTodos } from './ButtonTodos/ButtonTodos';
import { addTodos } from './hooks/add_todos';
import { updateTodos } from './hooks/update_todos';
import { deleteTodos } from './hooks/delete_todos';
import { getTodos } from './hooks/get_todos';
import { ExtendedLink } from './hooks/extended_link';
import {
	data,
	Navigate,
	Outlet,
	Route,
	Routes,
	useNavigate,
	useParams,
} from 'react-router-dom';
//npx json-server@0.17.4 --watch src/db.json --port 3005
export const App = () => {
	const [todos, setTodos] = useState([]);
	const [butonBackManePage, setButonBackManePage] = useState(false);

	const [but, setBut] = useState('Сортировка по алфавиту');

	useEffect(() => {
		getTodos(setTodos);
	}, []);

	const titleLength = (title) => {
		return title.length === 10 ? title : title.slice(0, 10) + '...';
	};

	const MainPage = () => {
		const [valueInput, setValueInput] = useState(''); // Добавление задачи
		const { onClickAddTodos, isCreating } = addTodos(setTodos, valueInput); // Добавление задачи

		let [valueInputSearch, setValueInputSearch] = useState(''); // Для поиска

		const inputSearchTodos = (e) => {
			valueInputSearch = e.target.value; // иначе будет первая строка при вводе пустая
			setValueInputSearch(valueInputSearch);
			if (valueInputSearch === '') {
				getTodos(setTodos);
			}
		};
		const search = todos.filter((item) => {
			return item.title
				.toLowerCase()
				.trim()
				.includes(valueInputSearch.toLowerCase());
		});

		const onClickSearch = () => {
			if (valueInputSearch !== '') {
				if (search.length !== 0) {
					setButonBackManePage(!butonBackManePage);
					setTodos(search);
				}
			} else {
				getTodos(setTodos);
			}
		};
		const onClickBackMainPage = () => {
			getTodos(setTodos);
			setButonBackManePage(!butonBackManePage);
		};

		const onClickSortTodos = (e) => {
			fetch('http://localhost:3005/todos/')
				.then((res) => res.json())
				.then((data) => {
					if (e.target.innerHTML === 'Вернуть сортировку') {
						data.sort((a, b) => b.title.localeCompare(a.title));
						setTodos(data);
						e.target.innerHTML = 'Сортировка по алфавиту';
						setBut('Сортировка по алфавиту');
						//getTodos(setTodos);
					}
					if (e.target.innerHTML === but) {
						data.sort((a, b) => a.title.localeCompare(b.title));
						setTodos(data);
						setBut('Вернуть сортировку');
					}
				});
		};

		return (
			<>
				<div>
					<InputTodos
						placeholder="Введите название задачи..."
						value={valueInput}
						onChange={(e) => setValueInput(e.target.value)}
					/>

					<ButtonTodos disabled={isCreating} onClick={onClickAddTodos}>
						Добавить задачу
					</ButtonTodos>
				</div>
				<div>
					<InputTodos
						//disabled={!checked}
						placeholder="Введите слово для поиска"
						value={valueInputSearch}
						onChange={inputSearchTodos}
					/>
					<ButtonTodos onClick={onClickSearch}>Найти</ButtonTodos>
				</div>
				<div>
					{' '}
					<ButtonTodos onClick={onClickSortTodos}>{but}</ButtonTodos>
				</div>
				{search.length === 0 && (
					<div style={{ color: 'red' }}> Нет такой задачи</div>
				)}

				{/* {isLoading ? (
					<div>Идет загрузка...</div>
				) : ( */}
				<div>
					<ul className={styles.older}>
						{todos.map(({ id, title }) => (
							// <li key={id} onClick={() => setValueChecked(id)}>
							<li key={id}>
								<ExtendedLink to={`/task/${id}`}>
									{titleLength(title)}
								</ExtendedLink>
							</li>
						))}
					</ul>
					<Outlet />
				</div>
				{/* )} */}
				{butonBackManePage && (
					<div>
						<ButtonTodos onClick={onClickBackMainPage}>Назад</ButtonTodos>
					</div>
				)}
			</>
		);
	};
	const Todos = () => {
		const { id } = useParams();
		const todo = todos.find((todo) => todo.id === Number(id));
		const [checked, setChecked] = useState(false);
		const [valueChecked, setValueChecked] = useState('');

		const [valueInputUpdate, setValueInputUpdate] = useState('');
		const navigate = useNavigate();

		const { onClickUpdateTodos } = updateTodos(
			setTodos,
			checked,
			valueChecked,
			valueInputUpdate,
		);

		const { onClickDeleteTodos } = deleteTodos(setTodos);

		const onClickBackListTodos = () => {
			//console.log('onClickBackListTodos');

			navigate('/', { replace: true });
		};

		return todo ? (
			<div>
				Контент страницы с задачей
				<ul className={styles.older}>
					<div>
						<InputTodos
							disabled={!checked}
							placeholder="На что изменяем?"
							value={valueInputUpdate}
							onChange={(e) => setValueInputUpdate(e.target.value)}
						/>
						<ButtonTodos onClick={onClickUpdateTodos}>
							Изменить задачу
						</ButtonTodos>
					</div>
					<li onClick={() => setValueChecked(id)}>
						{todo.title}

						<InputTodos
							type="checkbox"
							onChange={() => setChecked(!checked)}
							value={checked}
						/>
						<ButtonTodos onClick={() => onClickDeleteTodos(id)}>
							Удалить задачу
						</ButtonTodos>
					</li>
				</ul>
				<ButtonTodos onClick={onClickBackListTodos}>.</ButtonTodos>
			</div>
		) : (
			<div>Задача удалена</div>
		);
	};

	return (
		<div className={styles.app}>
			<h1>JSON Todos SERVER</h1>

			<h3>Меню</h3>
			<ul>
				<li>
					<ExtendedLink to="/">Главная</ExtendedLink>
				</li>
			</ul>

			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="task/:id" element={<Todos />} />
				<Route path="/404" element={<div>404 (страница не найдена)</div>} />
				<Route path="*" element={<Navigate to="/404" />} />
			</Routes>
		</div>
	);
};
