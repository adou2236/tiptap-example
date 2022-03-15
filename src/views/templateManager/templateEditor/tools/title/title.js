import {mergeAttributes, Node} from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-2";
import {Plugin, PluginKey} from "prosemirror-state";

export default Node.create({
    name: 'title',
    content: 'inline*',
    group: 'block',
    defining: true,

    addAttributes() {
        return {
        }
    },

    parseHTML() {
        return [{tag: 'title'}]
    },

    renderHTML({node,HTMLAttributes}) {
        let attr = {
            type:'title',
            style: `font-family: STZhongsong;font-size:18px;text-align:center`,
        }
        return ['p', mergeAttributes(attr,HTMLAttributes),0]
    },


    addCommands() {
        return {
            toggleTitle: attributes => ({ tr,commands }) => {
                return commands.toggleNode('title','paragraph',attributes)
            }
            
        }
    },
})
