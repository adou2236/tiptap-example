import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

const LineHeight = Extension.create({
    name: 'lineHeight',
    defaultOptions: {
        types: ['textStyle'],
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    lineHeight: {
                        default: null,
                        renderHTML: attributes => {
                            if (!attributes.lineHeight) {
                                return {};
                            }
                            return {
                                style: `line-height: ${attributes.lineHeight}`,
                            };
                        },
                        parseHTML: element => {
                            return {
                                fontSize: element.style['line-height'].replace(/['"]+/g, ''),
                            }
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setLineHeight: lineHeight => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { lineHeight })
                    .run();
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { lineHeight: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

export default LineHeight;
export { LineHeight };
