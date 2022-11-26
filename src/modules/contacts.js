import {reactive, ref} from 'vue'
import {SERVER_LINK} from "@/utils/helpers";
import { useNotification } from "@kyvg/vue3-notification";

const notification = useNotification()



const getContact = () => {
    const state = ref({
        btnLoading : false,
        loading : false,
        contacts : {},
        form : {
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
        },
        updateId : "",
        multipleSelect : false,
        selectIs : [],
        cont : []
    })

    const form = reactive({ ...state.value.form });


    const ContactList = async () => {
        state.value.loading = true
        try {
            await   fetch(SERVER_LINK+"list")
                .then(res => res.json())
                .then((data) => {
                     state.value.loading = false
                    if (data.succeed) state.value.contacts = data.list
                })

        }catch (e){
            console.log(e)
        }

    }

    const ContactAdd = async (data) => {

        const requestOptions = {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        }


        fetch(SERVER_LINK+"store",requestOptions)
            .then(res => res.json())
            .then((response)=>{
                state.value.btnLoading = false
                if (response.succeed){

                    notification.notify({
                        type: "success",
                        title: "Succes 🎉",
                         text : response.message
                    });

                    Object.assign(state.value.form, form);

                    ContactList()
                }else{

                    notification.notify({
                        type: "error",
                        title: "Erreur",
                        text : response.message
                    });
                }

            })
    }


    const updateContact = async (id,data) => {
        const requestOptions = {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        }

        fetch(SERVER_LINK+"update/"+id,requestOptions)
            .then(res => res.json())
            .then((response)=>{
                ContactList()
                Object.assign(state.value.form, form);
                notification.notify({
                    type: "success",
                    title: "Succes 🎉",
                    text : response.message
                });
            })
    }


    const removeContact = async (arrayId) => {

        const requestOptions = {
            method : "DELETE",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({id : arrayId})
        }

       fetch(SERVER_LINK+"delete",requestOptions)
           .then(res => res.json())
           .then((response)=>{
               ContactList()
               state.value.cont = []
               notification.notify({
                   type: "success",
                   title: "Succes 🎉",
                   text : response.message
               });
           })
    }





    return {
        state,
        ContactList,
        ContactAdd,
        removeContact,
        updateContact
    }

}




export default getContact