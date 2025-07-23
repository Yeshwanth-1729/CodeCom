import React,{useEffect,useRef} from 'react';
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import codemirror from 'codemirror/lib/codemirror';
import { use } from 'react';


function Editor({socketRef,roomid,oncodechange}) {
    const editorRef=useRef(null);
    useEffect(()=>{
        const init= async () => {
            const editor=CodeMirror.fromTextArea(
                document.getElementById("realTimeEditor"),{
                    mode:{name:"javascript",json:true},
                    theme:"dracula",
                    autoCloseTags:true,
                    autoCloseBrackets:true,
                    lineNumbers:true,
                }
            );
            editorRef.current=editor;
            editor.setSize(null,"100%");
            editor.on("change",(instance,changes) =>{
                //console.log(`changes`,instance,changes)
                const{origin}=changes;
                const code=instance.getValue();
                oncodechange(code);
                if(origin!=="setValue"){
                    socketRef.current.emit("code-change",{
                        roomid,
                        code
                    });
                }

    });
            
        };
        init();
    },[]);

    useEffect(()=>{
        if(socketRef.current){
            socketRef.current.on('code-change',({code})=>{
                if(code!==null){
                    editorRef.current.setValue(code);
                }
            });
        }
        return ()=>{
            
                socketRef.current.off('code-change');
            
        };
    },[socketRef.current]);
    
  return (
    <div style={{height:"800px"}}>
        <textarea id="realTimeEditor"></textarea>
      
    </div>
  ) 
}

export default Editor;

