import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

const UnderLine = Extension.create({
    name: 'underLine',
    defaultOptions: {
        types: ['textStyle'],
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    underLine: {
                        default: null,
                        renderHTML: attributes => {
                            if (!attributes.underLine) {
                                return {};
                            }
                            return {
                                style: `text-decoration: ${attributes.centerLine?'line-through':''} ${attributes.underLine?'underline':''}`,
                            };
                        },
                        parseHTML: element => {
                            return {
                                fontSize: element.style['text-decoration'].replace(/['"]+/g, ''),
                            }
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            toggleUnderline: () => ({ editor,chain,commands }) => {
                if(!editor.getAttributes("textStyle").underLine){
                    return chain()
                        .setMark('textStyle', { underLine:true })
                        .run();
                }else{
                    commands.unsetUnderLine()
                }

            },
            unsetUnderLine: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { underLine: false })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

export default UnderLine;
export { UnderLine };
