import { useState, useEffect } from 'react';
import styles from './app.module.css';
import { Input } from './Input/Input';
import { Button } from './Button/Button';
import { addTodos } from './hooks/add_todos';
import { updateTodos } from './hooks/update_todos';
import { deleteTodos } from './hooks/delete_todos';
import { getTodos } from './hooks/get_todos';
import { ExtendedLink } from './extended_link';
import {
	data,
	Navigate,
	Outlet,
	Route,
	Routes,
	useNavigate,
	useParams,
} from 'react-router-dom';
import { Search, TitleLength } from './utils/utils';
//npx json-server@0.17.4 --watch src/db.json --port 3005
export const App = () => {
	const [todos, setTodos] = useState([]);
	const [butonBackManePage, setButonBackManePage] = useState(false);

	const [but, setBut] = useState('Сортировка по алфавиту');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (isLoading) {
			getTodos(setTodos, isLoading);
		} else {
			setIsLoading(false);
		}
	}, []);

	const MainPage = () => {
		const [valueInput, setValueInput] = useState(''); // Добавление задачи
		const { onClickAddTodos } = addTodos(setTodos, valueInput); // Добавление задачи

		let [valueInputSearch, setValueInputSearch] = useState(''); // Для поиска

		const inputSearchTodos = (e) => {
			valueInputSearch = e.target.value; // иначе будет первая строка при вводе пустая
			setValueInputSearch(valueInputSearch);
			if (valueInputSearch === '') {
				getTodos(setTodos);
			}
		};

		const onClickSearch = () => {
			if (valueInputSearch !== '') {
				if (Search(todos, valueInputSearch).length !== 0) {
					setButonBackManePage(!butonBackManePage);
					setTodos(Search(todos, valueInputSearch));
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
					<Input
						placeholder="Введите название задачи..."
						value={valueInput}
						onChange={(e) => setValueInput(e.target.value)}
					/>

					<Button onClick={onClickAddTodos}>Добавить задачу</Button>
				</div>

				<div>
					<Input
						//disabled={!checked}
						placeholder="Введите слово для поиска"
						value={valueInputSearch}
						onChange={inputSearchTodos}
					/>
					<Button onClick={onClickSearch}>Найти</Button>
				</div>

				<div>
					{' '}
					<Button onClick={onClickSortTodos}>{but}</Button>
				</div>
				{Search(todos, valueInputSearch).length === 0 &&
					valueInputSearch !== '' && (
						<div style={{ color: 'red' }}> Нет такой задачи</div>
					)}
				{!isLoading ? (
					<div>Загрузка...</div>
				) : (
					<div>
						<ul className={styles.older}>
							{todos.map(({ id, title }) => (
								// <li key={id} onClick={() => setValueChecked(id)}>
								<li key={id}>
									<ExtendedLink to={`/task/${id}`}>
										{TitleLength(title)}
									</ExtendedLink>
								</li>
							))}
						</ul>
						<Outlet />
					</div>
				)}

				{butonBackManePage && (
					<div>
						<Button onClick={onClickBackMainPage}>Назад</Button>
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

		const { onClickUpdateTodos, isUpdating } = updateTodos(
			setTodos,
			checked,
			valueChecked,
			valueInputUpdate,
		);

		const { onClickDeleteTodos, isDeleting } = deleteTodos(setTodos);

		const onClickBackListTodos = () => {
			//console.log('onClickBackListTodos');

			navigate('/', { replace: true });
		};

		return todo ? (
			<div>
				Контент страницы с задачей
				<ul className={styles.older}>
					<div>
						<Input
							disabled={!checked}
							placeholder="На что изменяем?"
							value={valueInputUpdate}
							onChange={(e) => setValueInputUpdate(e.target.value)}
						/>
						<Button disabled={isUpdating} onClick={onClickUpdateTodos}>
							Изменить задачу
						</Button>
					</div>
					<li onClick={() => setValueChecked(id)}>
						{todo.title}

						<Input
							type="checkbox"
							onChange={() => setChecked(!checked)}
							value={checked}
						/>
						<Button
							disabled={isDeleting}
							onClick={() => onClickDeleteTodos(id)}
						>
							Удалить задачу
						</Button>
					</li>
				</ul>
				<Button onClick={onClickBackListTodos}>.</Button>
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
				<Route path="/404" element={<div>404 (страница ненайдена)</div>} />
				<Route path="*" element={<Navigate to="/404" />} />
			</Routes>
		</div>
	);
};
