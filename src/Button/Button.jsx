import styles from './Button.module.css';
export const Button = ({ children, ...props }) => {
	return children === '.' ? (
		<button className={styles.arr} {...props}>
			{children}
		</button>
	) : (
		<button {...props}>{children}</button>
	);
};
