function lineInsert(editor){
    editor.commands.insertContent({
        "type":"contentBox",
        "content":[{
            "type":"paragraph",
            "content":[]
        }]
    })

}
function tagInsert(editor){
    editor.commands.insertContent({
        "type":"customerTag",
        "attrs":{
            "type":type,
            "index":"economic"
        },
        "content":[
            {
                "type":"text",
                "text":text
            }
        ]
    })

}
