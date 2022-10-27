import { app } from "./firebase";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
const database = getFirestore(app);
export const getDocument = async(type:string):Promise<getDocumentResponse> => {
    const collectionDB = doc(database, type, "data");
    const response = {
        Status:false,
        Data:[]
    }
    try{
        const resp = await getDoc(collectionDB);
        if(resp.exists()){
            response.Status = true;
            response.Data = resp.data().Data;
        }
    }
    catch(err){
        console.log(err);
        
    }
    console.log(response);
    
    return response
}
export const setDocument =async (Data: any[],type:string) => {
    const collectionDB = doc(database, type, "data");
    await setDoc(collectionDB, {Data:Data}).catch(err => {
        console.log(err);
        return false;
    })
    return true;
}



interface getDocumentResponse {
    Status:boolean,
    Data:any
}
interface eventType {
    Title: string,
    Discription: string
    ImageUrl: string
    brochure:string
}
interface events {
    Data: eventType[]
}
