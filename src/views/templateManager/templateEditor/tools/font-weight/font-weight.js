import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

const FontWeight = Extension.create({
    name: 'fontWeight',
    defaultOptions: {
        types: ['textStyle'],
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontWeight: {
                        default: null,
                        renderHTML: attributes => {
                            if (!attributes.fontWeight) {
                                return {};
                            }
                            return {
                                style: `font-weight: ${attributes.fontWeight?'bold':''}`,
                            };
                        },
                        parseHTML: element => {
                            return {
                                fontWeight: element.style['font-weight'].replace(/['"]+/g, ''),
                            }
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            toggleFontWeight: () => ({ chain,editor,commands }) => {
                if(!editor.getAttributes("textStyle").fontWeight){
                    return chain()
                        .setMark('textStyle', { fontWeight:true } )
                        .run();
                }else{
                    commands.unsetFontWeight()
                }
            },
            unsetFontWeight: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontWeight: false })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

export default FontWeight;
export { FontWeight };
