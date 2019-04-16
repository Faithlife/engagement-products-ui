import React, { useCallback, useContext } from 'react';

const handledKeys = Object.freeze({
	arrowRight: 'ArrowRight',
	arrowLeft: 'ArrowLeft',
	arrowDown: 'ArrowDown',
	home: 'Home',
	end: 'End',
});

export const TabContext = React.createContext();

export function useTabContext() {
	const { onSelectTab, selectedTabIndex, panelsContainerRef, theme } = useContext(TabContext);

	return { onSelectTab, selectedTabIndex, panelsContainerRef, theme };
}

export function useKeyboardNav(selectedIndex, onSelectTab, panelsContainerRef, children) {
	const handleKeyboardNav = useCallback(
		event => {
			const enabledTabIndexes = React.Children.map(
				children,
				(child, index) => (child.props.disabled ? null : index),
			).filter(index => index !== null);
			const currentEnabledIndex = enabledTabIndexes.indexOf(selectedIndex);

			switch (event.key) {
				case handledKeys.arrowRight: {
					const nextEnabledIndex = (currentEnabledIndex + 1) % enabledTabIndexes.length;
					onSelectTab(enabledTabIndexes[nextEnabledIndex]);
					break;
				}
				case handledKeys.arrowLeft: {
					const nextEnabledIndex =
						(currentEnabledIndex - 1 + enabledTabIndexes.length) % enabledTabIndexes.length;
					onSelectTab(enabledTabIndexes[nextEnabledIndex]);
					break;
				}
				case handledKeys.arrowDown: {
					event.preventDefault();
					if (panelsContainerRef.current) {
						panelsContainerRef.current.focus();
					}
					break;
				}
				case handledKeys.home: {
					onSelectTab(enabledTabIndexes[0]);
					break;
				}
				case handledKeys.end: {
					onSelectTab(enabledTabIndexes[enabledTabIndexes.length - 1]);
					break;
				}
				default:
					return;
			}
		},
		[selectedIndex, onSelectTab, panelsContainerRef.current, children],
	);

	return handleKeyboardNav;
}
