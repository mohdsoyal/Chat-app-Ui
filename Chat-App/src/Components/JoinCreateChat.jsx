import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { createRoom, joinChatApi } from '../Service/RoomService';
import { useChatContext } from '../Context/ChatContext';
import { useNavigate } from 'react-router';

function JoinCreateChat() {


    const [detail,setDetail]=useState({
        roomId:'',
        userName:''
    });

    const {roomId, userName, setRoomId, setCurrentUser ,setConnected}=useChatContext();
    const navigate = useNavigate();
    function handleFormInputChange(event){

        setDetail({
            ...detail,
            [event.target.name]:event.target.value,
        });
    }

    function validateForm(){
        if(detail.roomId === "" || detail.userName === ""){
            toast.error("Invalid Input ?")
            return false;
        }
        return true;
    
    }

    async function joinChat(){

        if(validateForm()){

            try {
            const room = await joinChatApi(detail.roomId);
            toast.success("Joined.........")
            setCurrentUser(detail.userName);
            setRoomId(room.roomId);
            setConnected(true);
            navigate("/chat");
            } catch (error) {

                toast.error("Error in joining Room");
                
            }

        }

    }

    async  function createChat(){
        if(validateForm()){
            console.log(detail)

            try {
                const response = await createRoom({ roomId: detail.roomId})
                toast.success("Room Created Success")
                setCurrentUser(detail.userName);
                setRoomId(response.roomId);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                if(error.response && error.response.status === 400){
                    toast.error("Room Already Created ! ")
                }
                else{
                console.log(error);
                toast.error("Room Already Created !")
                }
               
            }
        }

    }

    return (

        <div className='min-h-screen flex items-center justify-center'>

            <div className='p-8 w-full max-w-md rounded dark:bg-gray-900 shadow'>
                <h1 className='font-2xl font-semibold text-center'>Join Room / Create Room</h1>

                <div className=''>
                    <label htmlFor="name" className='block font-medium mb-2'>Your Name</label>
                    <input onChange={handleFormInputChange} value={detail.userName} name="userName" type="text" id="name" className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg' />
                </div>

                <div className=''>
                    <label htmlFor="name" className='block font-medium mb-2'>Room ID / New Room ID</label>
                    <input onChange={handleFormInputChange} value={detail.roomId} name="roomId"  type="text" id="name" className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg' />
                </div>

                <div className='mt-4 flex justify-center gap-2'>
                    <button onClick={joinChat} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-900 text-white rounded">
                        Join Room
                    </button>

                     <button onClick={createChat} className="px-3 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-900 text-white rounded">
                        Create Room
                    </button>
                </div>

            </div>

        </div>
    )
}

export default JoinCreateChat