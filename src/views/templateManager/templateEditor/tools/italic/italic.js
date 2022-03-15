import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

const Italic = Extension.create({
    name: 'italic',
    defaultOptions: {
        types: ['textStyle'],
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    italic: {
                        default: null,
                        renderHTML: attributes => {
                            if (!attributes.italic) {
                                return {};
                            }
                            return {
                                style: `font-style: ${attributes.italic?'italic':''}`,
                            };
                        },
                        parseHTML: element => {
                            return {
                                italic: element.style['font-style'].replace(/['"]+/g, ''),
                            }
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            toggleItalic: () => ({ chain,editor,commands }) => {
                if(!editor.getAttributes("textStyle").italic){
                    return chain()
                        .setMark('textStyle', { italic:true } )
                        .run();
                }else{
                    commands.unsetItalic()
                }
            },
            unsetItalic: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { italic: false })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

export default Italic;
export { Italic };
