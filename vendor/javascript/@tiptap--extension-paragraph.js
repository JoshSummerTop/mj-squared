// @tiptap/extension-paragraph@3.2.0 downloaded from https://ga.jspm.io/npm:@tiptap/extension-paragraph@3.2.0/dist/index.js

import{Node as t,mergeAttributes as r}from"@tiptap/core";var e=t.create({name:"paragraph",priority:1e3,addOptions(){return{HTMLAttributes:{}}},group:"block",content:"inline*",parseHTML(){return[{tag:"p"}]},renderHTML({HTMLAttributes:t}){return["p",r(this.options.HTMLAttributes,t),0]},addCommands(){return{setParagraph:()=>({commands:t})=>t.setNode(this.name)}},addKeyboardShortcuts(){return{"Mod-Alt-0":()=>this.editor.commands.setParagraph()}}});var a=e;export{e as Paragraph,a as default};

