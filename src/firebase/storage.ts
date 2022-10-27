import { async } from '@firebase/util';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from './firebase';


const storage = getStorage(app);
export const deleteFile= async(page:string,title:string)=>{
    const storageRef = ref(storage, `/${page}/${title}`);
    await deleteObject(storageRef);
}
export const fileUpload = async (file: File, page: string, title: string) => {
    // var dataUrl = "";
    const storageRef = ref(storage, `/${page}/${title}`)
    const fileUpload = uploadBytesResumable(storageRef, file);
    fileUpload.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            // update progress
            console.log(percent);

        },
        (err) => console.log(err),
        () => {
            // download url
            getDownloadURL(fileUpload.snapshot.ref).then((url) => {
                // dataUrl = url;
                console.log(url);
            });
        }
    );
    // return dataUrl;
}
