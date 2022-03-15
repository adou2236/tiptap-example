import TableCell from '@tiptap/extension-table-cell'
import {mergeAttributes} from '@tiptap/core'

const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            // extend the existing attributes …
            ...this.parent?.(),

            colwidth:{
                default:null,
                parseHtml:element => {
                    let colwidth = element.getAttribute("colwidth")
                    let value = colwidth ? colwidth.split(',').map(item=>parseInt(item)): null
                    return value
                }
            },

            // and add a new one …
            backgroundColor: {
                default: null,
                parseHTML: element => {
                    let backgroundColor =  element.getAttribute('background-color')
                    return {
                        'background-color':backgroundColor,
                    }
                },
            },
        }
    },
    renderHTML({ HTMLAttributes }){
        let totalWidth = 0
        let fixedWidth = true
        let backgroundColor = ''
        let style = 'selection:#000;'
        if(HTMLAttributes.colwidth){
            HTMLAttributes.colwidth.forEach((col)=>{
                if(!col){
                    fixedWidth = false
                }else {
                    totalWidth += col;
                }
            })
        }else{
            fixedWidth = false
        }
        if(HTMLAttributes.backgroundColor){
            backgroundColor = HTMLAttributes.backgroundColor
            style += `background-color:${backgroundColor};`
        }
        

        if(fixedWidth && totalWidth > 0){
            style += `width:${totalWidth}px;`

        }else if (totalWidth && totalWidth > 0){
            style += `min-width:${totalWidth}px;`
        }
        HTMLAttributes.style = style
        return [
            'td',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0
        ];
    }
})
export default CustomTableCell;
export { CustomTableCell };
