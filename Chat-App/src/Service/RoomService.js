import axios from "axios";

// ✅ Fixed baseURL
export const baseURL = "http://localhost:8080/room";

export const publicAxios = axios.create({
    baseURL: baseURL,
});

// ✅ Fixed Content-Type and typo
export const createRoom = async (roomDetail) => {
    const response = await publicAxios.post(`/create`, roomDetail, {
        headers: {
           "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const joinChatApi = async (roomId)=>{

   const response = await publicAxios.get(`/${roomId}`)

   return response.data;
    
}

export const getMessages= async(roomId , size=50 , page=0)=>{

    const response = await publicAxios.get(`${roomId}/messages?size=${size}&page=${page}`);
    return response.data;

}