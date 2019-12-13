import React, {
	useCallback,
	useRef,
	useMemo,
	useEffect,
	useState,
	useImperativeHandle,
} from 'react';
import styled, { css } from 'styled-components';
import './styles.css';
import { LocalizationProvider } from '../components/Localization';
import localizedResources from '../locales/en-US/resources.json';
import { FilePickerModal } from '../components/FilePickerModal';
import { useImageControls } from '../utility/useImageControls';
import { ResizableOverlay } from '../components/ResizableOverlay';
import { throttle } from '../utility/throttle';
import ImageBlot from '../components/Blots/ImageBlot';
import { useImageDrop } from '../utility/useImageDrop';
import { SafeQuill, SafeReactQuill } from './SafeQuill';
import { getRenderedHtmlContent } from '../utility/getRenderedHtmlContent';
import { getShortcuts } from './shortcuts';

export interface IQuillRichTextEditorProps {
	groupId?: string;
	defaultValue?: any;
	value?: any;
	formats?: string[];
	toolbarHandlers?: { [key: string]: any };
	modules?: { [key: string]: any };
	placeholder?: string;
	onContentChange: (delta: any | null) => void;
	onClick?: (e: React.MouseEvent) => void;
	onBlur?: () => void;
	className?: string;
	classNames?: string[];
	editorId?: string;
	onFocus?: () => void;
	onKeyDown?: () => void;
	onKeyPress?: () => void;
	onKeyUp?: () => void;
	onChangeSelection?: () => void;
	onImageUpload?: (file: File) => void;
	autofocus?: string;
	tabMode?: 'insert' | 'exit';
	disableImageControls?: boolean;
	children?: React.ReactNode;
}

export interface IQuillContainerProps {
	linkHelpText?: string;
	linkSaveText?: string;
}

export enum FilePickerKind {
	Image = 'image',
	Text = 'text',
}

type Source = 'user' | 'api' | 'silent';

const ReactQuillStyled = styled(SafeReactQuill)`
	min-height: 32px;
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	& > [data-placeholder]:empty {
		padding: 7px 6px 6px;
	}

	& > [data-placeholder]:empty::before {
		content: attr(data-placeholder);
		color: #a8a8a8;
	}

	.ql-container.ql-snow {
		border: none;

		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	.ql-editor {
		font-family: Source Sans Pro;
		font-size: 16px;
		line-height: normal;
		padding: 8px;
		flex: 1;
	}

	// Placeholder styling
	.ql-editor.ql-blank::before {
		font-style: normal;
		color: #a8a8a8;
	}

	.ql-editor.nwse-resize > * {
		cursor: nwse-resize !important;
	}

	.ql-editor.nesw-resize > * {
		cursor: nesw-resize !important;
	}

	img {
		cursor: move;
	}

	.ql-image-wrap img {
		float: left;
		margin-right: 16px;
		margin-bottom: 8px;
	}

	.ql-align-right .ql-image-wrap img {
		float: right;
		margin-left: 16px;
	}
`;

const QuillContainer = styled.div<{ isEmpty: boolean }>`
	display: flex;
	flex-direction: column;
	position: relative;

	border: 1px solid #a8a8a8;
	border-radius: 3px;
	box-sizing: border-box;

	.ql-snow .ql-tooltip {
		z-index: 1;
	}

	.ql-snow .ql-tooltip[data-mode=link]::before {
		content: '${({ linkHelpText }) => linkHelpText}';
	}

	.ql-snow .ql-tooltip[data-mode=link] .ql-action::after {
		content: '${({ linkSaveText }) => linkSaveText}';
	}

	.ql-header .ql-picker-item {
		line-height: 1.4em;
	}

	${({ imageIsSelected }) =>
		imageIsSelected &&
		`img::selection {
			background: rgba(0, 0, 0, 0);
		}
	`}

	${({ isEmpty }) =>
		isEmpty &&
		css`
			.ql-editor::before {
				content: '';
			}
		`}
`;

const OverlayContainer = styled.div<{ hasToolbar: boolean }>`
	overflow: auto;
	position: absolute;
	left: 0;
	right: 0;
	top: ${({ hasToolbar }) => (hasToolbar ? '41px' : '0')};
	bottom: 0;
	pointer-events: none;
`;

const ReplacementPlaceholder = styled.div`
	position: absolute;
	top: 8px;
	left: 8px;
	color: #a8a8a8;
	font-size: 16px;
	font-family: Source Sans Pro, sans-serif;
	pointer-events: none;
`;

if (SafeQuill) {
	const Parchment = SafeQuill.import('parchment');
	const ImageAlignClass = new Parchment.Attributor.Class('imageAlign', 'ql-image', {
		scope: Parchment.Scope.INLINE,
	});
	SafeQuill.register(ImageAlignClass);
	SafeQuill.register({ 'formats/faithlifeImage': ImageBlot });
}

const QuillEditorCore: React.FunctionComponent<IQuillRichTextEditorProps> = (
	{
		groupId,
		defaultValue,
		value,
		formats,
		toolbarHandlers,
		modules,
		placeholder,
		onContentChange,
		onClick,
		onBlur,
		className,
		classNames,
		editorId,
		onImageUpload,
		autofocus,
		tabMode,
		disableImageControls,
		children,
		...otherProps
	},
	ref
) => {
	const quillRef = useRef<any>(null);
	const quillContainerRef = useRef<any>(null);
	const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
	const [filePickerKind, setFilePickerKind] = useState(FilePickerKind.Image);
	const [storedValue, setStoredValue] = useState(value);
	const [allowImageLink, setAllowImageLink] = useState(false);
	const [quillEditorId] = useState(
		() =>
			editorId ||
			`ql-${Math.random()
				.toString(36)
				.substring(7)}`
	);

	const [quillEditorQuery] = useState(() => `.${quillEditorId}`);
	const [isEmpty, setIsEmpty] = useState(!(defaultValue || value));

	useEffect(() => {
		if (!defaultValue && value && value !== storedValue && quillRef.current) {
			if (value.ops) {
				quillRef.current.getEditor().setContents(value, 'user');
			} else {
				quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, value);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		if (quillRef.current) {
			quillRef.current.getEditor().root.dataset.placeholder = placeholder;
		}
	}, [placeholder]);

	useEffect(() => {
		const elements = quillContainerRef.current.querySelectorAll('.ql-picker-label');
		elements.forEach(element => {
			element.removeAttribute('tabindex');
		});

		if (quillRef.current) {
			const history = (quillRef.current.getEditor() as any).history;
			if (history) {
				history.clear(); // Don't allow undo of initial content insertion
			}

			if (autofocus) {
				quillRef.current.getEditor().focus();
				if (autofocus === 'end') {
					quillRef.current.getEditor().setSelection(quillRef.current.getEditor().getLength(), 0);
				}
			}
		}

		// Disable Firefox native image resizing
		document.execCommand('enableObjectResizing', false, 'false');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [imageInsertRange, setImageInsertRange] = useState<{
		index: number;
		length: number;
	} | null>();

	const openFilePicker = useCallback(() => {
		if (quillRef.current) {
			const quillApi = quillRef.current.getEditor();
			const range = quillApi.getSelection();
			setImageInsertRange(range ? range : null);
			quillRef.current.blur();
			onBlur && onBlur();
		}
		setShowFilePicker(true);
	}, [onBlur]);

	const insertFile = useCallback(
		async data => {
			const { assets } = data;
			const editorMaxContentWidthPixels = 495;

			if (quillRef.current) {
				const quillApi = quillRef.current.getEditor();
				let insertLocation = (imageInsertRange && imageInsertRange.index) || 0;
				if (imageInsertRange && imageInsertRange.length) {
					quillApi.deleteText(imageInsertRange.index, imageInsertRange.length);
				}
				assets.forEach(async asset => {
					switch (asset.kind) {
						case 'image': {
							// todo: optimize link based on size (e.g. HTML width) of embedded image
							// various formats are available at asset.formats, with dimensions of format at asset.formats[x].file.dimensions
							const originalWidth =
								asset.file && asset.file.dimensions && asset.file.dimensions.width;
							const imageWidth = originalWidth
								? `${Math.min(editorMaxContentWidthPixels, originalWidth)}px`
								: `${editorMaxContentWidthPixels}px`;

							quillApi.insertText(insertLocation++, '\n', 'user');
							quillApi.insertEmbed(
								insertLocation++,
								'faithlifeImage',
								{ url: asset.file.url, width: imageWidth, imageAlign: '' },
								'user'
							);

							quillApi.setSelection({ index: insertLocation, length: 0 });
							break;
						}
						case 'word':
						case 'text': {
							const htmlFormat = asset.formats.find(
								format => format.firstFile && format.firstFile.mediaType === 'text/html'
							);
							const plaintextFormat = asset.formats.find(
								format => format.firstFile && format.firstFile.mediaType === 'text/plain'
							);
							const format = htmlFormat || plaintextFormat;
							const fileUrl =
								(format && format.file && format.file.url) ||
								(format.firstFile && format.firstFile.url);
							if (fileUrl) {
								const response = await fetch(fileUrl);
								const content = await response.text();
								quillApi.clipboard.dangerouslyPasteHTML(insertLocation, content);
							}
							break;
						}
						default: {
							if (imageInsertRange) {
								if (imageInsertRange.length === 0) {
									quillApi.insertText(
										imageInsertRange.index,
										asset.file.name,
										'link',
										asset.file.linkUri
									);
									quillApi.setSelection(imageInsertRange.index, asset.file.name.length);
								} else {
									quillApi.formatText(
										imageInsertRange.index,
										imageInsertRange.length,
										'link',
										asset.file.linkUri
									);
								}
								quillApi.format('download', asset.file.name);
							}
						}
					}
					setShowFilePicker(false);
				});
			}
		},
		[imageInsertRange]
	);

	const closeFilePicker = useCallback(() => {
		setShowFilePicker(false);
		if (quillRef.current) {
			quillRef.current.focus();
		}
	}, []);

	const {
		overlayCoordinates,
		handleClickOnEditor,
		handleTextChangeOnEditor,
		handleScrollOnEditor,
		handleOverlayResize,
		handleOverlayResizeComplete,
		handleAlignmentChange,
		currentAlignment,
	} = useImageControls(quillEditorQuery, setAllowImageLink);

	const onEditorClick = useCallback(
		event => {
			handleClickOnEditor(event.target, quillRef.current);
		},
		[handleClickOnEditor]
	);

	const updateLinkButton = useCallback(() => {
		if (quillContainerRef.current) {
			const selection = window.getSelection();
			const textNodeType = 3;
			const childNode: any =
				selection &&
				selection.focusNode &&
				((selection.focusNode.nodeType === textNodeType && selection.focusNode.parentElement) ||
					selection.focusNode);
			const editorNode: any = childNode && childNode.closest && childNode.closest('.ql-editor');
			const linkNodes = quillContainerRef.current.querySelectorAll('.ql-insertLink');
			if ((selection && editorNode && !selection.isCollapsed) || allowImageLink) {
				linkNodes.forEach(link => link.removeAttribute('disabled'));
			} else {
				linkNodes.forEach(link => link.setAttribute('disabled', 'disabled'));
			}
		}
	}, [allowImageLink]);

	useEffect(() => {
		updateLinkButton();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allowImageLink]);

	const handleSelectionChange = useCallback(throttle(updateLinkButton, 200), [allowImageLink]);

	useEffect(() => {
		document.addEventListener('selectionchange', handleSelectionChange);
		return () => {
			document.removeEventListener('selectionchange', handleSelectionChange);
		};
	}, [handleSelectionChange]);

	const handleTextChange = useCallback(() => {
		let content = defaultValue;

		if (!content && quillRef.current) {
			const deltaContent = quillRef.current.getEditor().getContents();
			if (value && value.ops) {
				content = deltaContent;
			} else {
				content = quillRef.current.getEditor().root.innerHTML;
			}
		}

		if (content) {
			setStoredValue(content);
		}
		onContentChange && onContentChange(content);
		handleTextChangeOnEditor();
		setIsEmpty(quillRef.current && quillRef.current.getEditor().getLength() === 1);
	}, [handleTextChangeOnEditor, onContentChange, defaultValue, value]);

	useEffect(() => {
		let editor;
		if (quillRef.current) {
			editor = quillRef.current.getEditor();
			if (editor) {
				editor.on('text-change', handleTextChange);
			}
		}
		return () => editor && editor.off('text-change', handleTextChange);
	}, [handleTextChange]);

	useEffect(() => {
		let editorElement;
		if (quillContainerRef.current) {
			editorElement = quillContainerRef.current.querySelector('.ql-editor');
			if (editorElement) {
				editorElement.addEventListener('click', onEditorClick);
			}
		}
		return () => editorElement && editorElement.removeEventListener('click', onEditorClick);
	}, [onEditorClick]);

	const handleImageDrop = useImageDrop(quillRef, onImageUpload);
	useEffect(() => {
		const editorElement = quillRef.current && quillRef.current.getEditor().root;
		editorElement && editorElement.addEventListener('drop', handleImageDrop);
		return () =>
			(editorElement && editorElement.removeEventListener('drop', handleImageDrop)) || undefined;
	}, [handleImageDrop]);

	const insertText = useCallback(
		(text: string, start?: number, end?: number, source: Source = 'user') => {
			if (quillRef.current) {
				const quillApi = quillRef.current.getEditor();
				const selection = quillApi.getSelection(true);
				const from = start || selection.index;
				const to = end || start || selection.index + selection.length;

				quillApi.deleteText(from, to - from, source);
				quillApi.insertText(from, text, source);
				quillApi.setSelection(from + text.length, 0, source);
			}
		},
		[]
	);

	const deleteText = useCallback((start?: number, end?: number, source: Source = 'user') => {
		if (quillRef.current) {
			const quillApi = quillRef.current.getEditor();
			const selection = quillApi.getSelection(true);
			const from = start || selection.index;
			const to = end || start || selection.index + selection.length;

			quillApi.deleteText(from, to - from, source);
		}
	}, []);

	const getHTML = useCallback((options?: { [key: string]: any }) => {
		if (quillRef.current) {
			const deltas = quillRef.current.getEditor().getContents();
			const { format, ...converterOptions } = options || {};
			if (format === 'inline') {
				return getRenderedHtmlContent(deltas.ops, converterOptions);
			} else {
				return quillRef.current.getEditor().root.innerHTML;
			}
		}
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			insertText,
			deleteText,
			getHTML,
			getEditor: () => quillRef.current && quillRef.current.getEditor(),
		}),
		[insertText, deleteText, getHTML]
	);

	const handleLinkInsert = useCallback(function(this: any) {
		const tooltip = this.quill.theme.tooltip;
		tooltip.textbox.dataset.link = 'https://example.com';
		tooltip.edit('link', '');
	}, []);

	const imageHandler = useCallback(() => {
		setFilePickerKind(FilePickerKind.Image);
		openFilePicker();
	}, [openFilePicker]);

	const textHandler = useCallback(() => {
		setFilePickerKind(FilePickerKind.Text);
		openFilePicker();
	}, [openFilePicker]);

	const insertTemplate = useCallback((textToInsert: string) => {
		if (quillRef.current) {
			const quillApi = quillRef.current.getEditor();
			const selection = quillApi.getSelection(true);
			quillApi.deleteText(selection.index, selection.length);
			quillApi.insertText(selection.index, textToInsert);
		}
	}, []);

	const handleClean = useCallback((a, b) => {
		if (quillRef.current) {
			const selection = quillRef.current.getEditor().getSelection();
			const cleanBlot = blot => {
				if (!blot || !blot.domNode) {
					return;
				}
				const img = blot.domNode.tagName === 'IMG';
				const attributes = blot.attributes && blot.attributes.attributes;
				const formats = blot.formats && blot.formats();
				const formatsToClean = img
					? ['link', 'imageAlign']
					: [
							'imageAlign',
							'list',
							...(attributes ? Object.keys(attributes) : []),
							...(formats ? Object.keys(formats) : []),
					  ];

				const childrenToClean = blot.children;

				if (blot.format) {
					formatsToClean.forEach(format => {
						blot.format(format, false);
					});
				}

				if (childrenToClean) {
					childrenToClean.forEach(child => {
						cleanBlot(child);
					});
				}
			};
			if (selection.length > 0) {
				quillRef.current
					.getEditor()
					.getLines(selection)
					.forEach(line => {
						cleanBlot(line);
					});
			} else {
				const line = quillRef.current.getEditor().getLine(selection.index)[0];
				cleanBlot(line);
				const lineRefreshed = quillRef.current.getEditor().getLine(selection.index)[0];
				cleanBlot(lineRefreshed);
			}
		}
	}, []);

	const moduleConfiguration = useMemo(
		() => ({
			toolbar: editorId
				? {
						container: `#${quillEditorId}`,
						handlers: {
							insertTemplate,
							insertImage: imageHandler,
							textSnippet: textHandler,
							insertLink: handleLinkInsert,
							clean: handleClean,
							...toolbarHandlers,
						},
				  }
				: false,
			...modules,
			keyboard: {
				...((modules && modules.keyboard) || {}),
				bindings: {
					...(tabMode === 'insert' ? {} : { tab: false }),
					...getShortcuts(quillRef),
					...((modules && modules.keyboard && modules.keyboard.bindings) || {}),
				},
			},
			clipboard: { matchVisual: false, ...((modules && modules.clipboard) || {}) },
		}),
		[
			insertTemplate,
			imageHandler,
			textHandler,
			handleLinkInsert,
			editorId,
			modules,
			quillEditorId,
			toolbarHandlers,
			tabMode,
			handleClean,
		]
	);

	const allowedFormats = formats || [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'indent',
		'link',
		'image',
		'faithlifeImage',
		'width',
		'align',
		'imageAlign',
	];

	const [placeholderDiv] = useState(() => (
		<div data-placeholder={defaultValue || value || placeholder} />
	));

	return (
		<LocalizationProvider localizedResources={localizedResources}>
			<QuillContainer
				ref={quillContainerRef}
				onClick={onClick}
				onScroll={handleScrollOnEditor}
				className={[...(classNames || []), className, quillEditorId]}
				linkHelpText={localizedResources.toolbar.enterLink}
				linkSaveText={localizedResources.toolbar.save}
				imageIsSelected={!!overlayCoordinates}
				isEmpty={isEmpty}
			>
				{children}
				{SafeQuill ? (
					<ReactQuillStyled
						ref={quillRef}
						defaultValue={defaultValue || value}
						placeholder={placeholder}
						modules={moduleConfiguration}
						formats={allowedFormats}
						bounds={quillEditorQuery}
						{...otherProps}
					>
						{placeholderDiv}
					</ReactQuillStyled>
				) : (
					<ReactQuillStyled className="quill">{placeholderDiv}</ReactQuillStyled>
				)}
				<OverlayContainer hasToolbar={!!editorId}>
					{isEmpty && <ReplacementPlaceholder>{placeholder}</ReplacementPlaceholder>}
					{overlayCoordinates && (
						<ResizableOverlay
							onOverlayResizeComplete={handleOverlayResizeComplete}
							onOverlayResize={handleOverlayResize}
							top={overlayCoordinates.top}
							left={overlayCoordinates.left}
							initialWidth={overlayCoordinates.width}
							initialHeight={overlayCoordinates.height}
							quillEditorQuery={quillEditorQuery}
							currentAlignment={currentAlignment}
							onAlignmentChange={handleAlignmentChange}
							disableImageControls={disableImageControls}
						/>
					)}
				</OverlayContainer>
				<FilePickerModal
					showFilePicker={showFilePicker}
					insertFile={insertFile}
					closeFilePicker={closeFilePicker}
					groupId={groupId}
					pickerKind={filePickerKind}
				/>
			</QuillContainer>
		</LocalizationProvider>
	);
};

export const QuillEditor = React.forwardRef(QuillEditorCore);