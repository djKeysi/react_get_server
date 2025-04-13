export const Search = (todos, valueInputSearch) => {
	return todos.filter((item) => {
		return item.title.toLowerCase().trim().includes(valueInputSearch.toLowerCase());
	});
};
export const TitleLength = (title) => {
	return title.length === 10 ? title : title.slice(0, 10) + '...';
};
