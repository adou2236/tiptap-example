import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

const CenterLine = Extension.create({
    name: 'centerLine',
    defaultOptions: {
        types: ['textStyle'],
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    centerLine: {
                        default: null,
                        renderHTML: attributes => {
                            if (!attributes.centerLine) {
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
            toggleCenterline: () => ({ editor,chain,commands }) => {
                if(!editor.getAttributes("textStyle").centerLine){
                    return chain()
                        .setMark('textStyle', { centerLine:true })
                        .run();
                }else{
                    commands.unsetCenterLine()
                }

            },
            unsetCenterLine: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { centerLine: false })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

export default CenterLine;
export { CenterLine };
