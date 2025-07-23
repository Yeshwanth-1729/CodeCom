import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuid } from "uuid";
import { useNavigate } from 'react-router-dom';


function Home() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();



    const generateRoomId = (e) => {
        e.preventDefault();
        const id = uuid();
        setRoomId(id);
        toast.success("RoomId is created");

    }
    const joinRoom = (e) => {
        if (!roomId || !username) {
            toast.error("Both fields are required")
        }
        //navigating
        else {
            navigate(`/editor/${roomId}`, { state: { username } });
            toast.success("Room is created")
        }
    }

    return (
        <div className='container-fluid'>
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className='col-12 col-md-6'>
                    <div className='card shadow-sm p-2 mb-5 bg-secondry-rounded'>
                        <div className='card-body text-center bg-dark'>
                            < img src='CollabCO.png' alt='CodeCom' height="200" />
                            <h4 className='text-light mb-4'>Enter the Room ID</h4>
                            <div className='form-group'>
                                <input type='text' className='form-control mb-2' placeholder='Room Id'
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}

                                />

                            </div>
                            <div className='form-group'>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' className='form-control mb-2' placeholder='Username' />

                            </div>
                            <button
                                onClick={joinRoom}
                                className='btn btn-success btn-lg'
                            >Join</button>



                            <p className='mt-3 text-light'>Don't have a room Id ?  <span
                                className='text-success'
                                style={{ cursor: 'pointer' }}
                                onClick={generateRoomId}
                            >
                                Create Room</span></p>

                        </div>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default Home
