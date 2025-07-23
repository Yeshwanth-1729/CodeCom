import React,{useEffect, useRef, useState} from 'react';
import Client from "./client";
import Editor from './Editor';
import { initSocket } from '../socket';
import {useNavigate,useLocation , useParams, Navigate} from 'react-router-dom';
import { toast } from 'react-hot-toast';



function EditorPage() {
        const [clients,setClient]=useState([
       
    ]);
    const socketRef=useRef(null);
    const codeRef=useRef(null);
    const location=useLocation();
    const {roomid}=useParams();
    const navigate=useNavigate();
    useEffect(()=>{
          const init=async()=>{
             socketRef.current=await initSocket();
             socketRef.current.on('connect_error',(err)=>handleError(err));
             socketRef.current.on('connect_failed',(err)=>handleError(err));
             const handleError=(err)=>{
                console.log("socket error",err);
                alert("Socket connection failed, try again later");
                navigate("/");
             }
                 socketRef.current.emit('join',{
                roomid,
                username:location.state?.username
             })
              socketRef.current.on('joined',({clients,username,socketId})=>{
                    if(username !==location.state?.username){
                        toast.success(`${username} has joined the room`);
                        
                    }
                    setClient(clients)
                    socketRef.current.emit('sync-code',{
                        socketId,
                        code:codeRef.current
                        
                    });
                });

                //diconnected
                socketRef.current.on('disconnected',({socketId,username})=>{
                    toast.success(`${username} has left the room`);
                    setClient((prev)=>prev.filter((client)=>client.socketId!=socketId));
                });



               
          };
          init();
          return ()=>{
            if(socketRef.current){
                socketRef.current.disconnect();
                socketRef.current.off('joined');
                socketRef.current.off('disconnected');
            }
          }                 
        
    },[])


    if(!location.state){
        return <Navigate to="/" />
    }
    const copyroomid=()=>{
        navigator.clipboard.writeText(roomid);
        toast.success("Room ID copied to clipboard");
    };

    const leaveroom=()=>{
        socketRef.current.disconnect();
        navigate("/");
    };
  return (
    <div className='container-fluid vh=100'>
    <div className='row h-100'>
        <div className='col-md-2 text-light bg-dark  d-flex flex-column vh-100 ' style={{boxShadow: "2px 0px 4px rgba(0 0 0 0.1)" }}>
               <img src='/CollabCO.png' alt='codecollab' height="200"    style={{marginTop:"-40px"}}/> 
               <hr style={{marginTop:"-40px"}}/> 
        

        {/* client details*/}
        <div className='d-flex flex-column overflow-auto '>
            {clients.map((client)=>(
                  <Client key={client.socketId} username={client.username}/>
            ))}
        </div>
        
       
       {/*buttons*/}
       <div className='mt-auto'>
       <hr/>
        <button onClick={copyroomid} className='btn btn-success '>Copy Room Id</button>
        <button onClick={leaveroom} className='btn btn-danger mt-2 mb-2 px-3 d-flex'>Leave</button>
       </div>

       
       </div>


        {/* editor*/}
        <div className='col-md-10 text-light d-flex flex-column vh-100'>
            <Editor socketRef={socketRef} roomid={roomid} oncodechange={(code)=> (codeRef.current=code)} />
        </div>
    </div>

   </div>
  )
  
}


export default EditorPage;
