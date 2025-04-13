import styles from './Button.module.css';
export const ButtonTodos = ({ children, ...props }) => {
	return children === '.' ? (
		<button className={styles.arr} {...props}>
			{children}
		</button>
	) : (
		<button {...props}>{children}</button>
	);
};
