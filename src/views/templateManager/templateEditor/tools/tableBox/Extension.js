import Table from '@tiptap/extension-table'
import { mergeAttributes } from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-2";
import { Figure } from '../figure/figure'
import { Figcaption } from '../figure/figcaption'


export default Figure.extend({
    name: 'custom-table',
    draggable:false,
})
