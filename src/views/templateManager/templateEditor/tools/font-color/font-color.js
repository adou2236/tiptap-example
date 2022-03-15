import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

const FontColor = Extension.create({
    name: 'fontColor',
    defaultOptions: {
        types: ['textStyle'],
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontColor: {
                        default: null,
                        renderHTML: attributes => {
                            if (!attributes.fontColor) {
                                return {};
                            }
                            return {
                                style: `color: ${attributes.fontColor}`,
                            };
                        },
                        parseHTML: element => {
                            return {
                                fontColor: element.style.color.replace(/['"]+/g, ''),
                            }
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontColor: fontColor => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontColor })
                    .run();
            },
            unsetFontColor: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontColor: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

export default FontColor;
export { FontColor };
