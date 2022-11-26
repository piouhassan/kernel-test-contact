<template>
  <section>
      <div class="left">
        <h3>NOUVEAU CONTACT</h3>
        <hr>

        <form  @submit.prevent="onsubmit" ref="contactForm" >

            <div class="form-input">
              <input type="text" placeholder="Nom" ref="firstname"  v-model="state.form.firstname"   @input="$emit('update:firstname', $event.target.value)" required/>
            </div>

          <div class="form-input">
            <input type="text" placeholder="Prénom(s)" ref="lastname" v-model="state.form.lastname" required />
          </div>

            <div class="form-input">
              <input type="text" placeholder="Numéro de Téléphone" ref="phone" v-model="state.form.phone" required />
            </div>

            <div class="form-input">
              <input type="email" placeholder="Email" ref="email" v-model="state.form.email" required />
            </div>

          <button  v-if="state.btnLoading" class="btn-send" type="submit" disabled="true" >Loading...</button>
          <button v-else class="btn-send" type="submit" >
            <span v-if="state.updateId">Modifier</span>
            <span v-else>Ajouter</span>
            <span></span>
          </button>

        </form>

      </div>
    <div class="right">
      <h2>Contacts</h2>

      <div class="" v-if="state.loading">
         <h5>Chargement en cours...</h5>
      </div>
        <div v-else class="list_contact">
            <button  v-if="state.cont.length > 0"  @click="deleteRecords" class="btn-small btn-danger">Supprimer</button>

           <table class="styled-table">
             <thead>
             <tr>
               <td><input type="checkbox" v-model="state.multipleSelect" @change="selectAllContact" ></td>
               <th>Nom</th>
               <th>Prénom(s)</th>
               <th>Numéro</th>
               <th>Email</th>
               <th>Action</th>
             </tr>
             </thead>

             <tbody v-for="contact in state.contacts" :key="contact._id">
             <tr>
               <td><input type="checkbox" v-model="state.cont" @change="selectSingleContact" :value="contact._id"></td>
               <td>{{contact.lastname}}</td>
               <td>{{contact.firstname}}</td>
               <td>{{contact.phone}}</td>
               <td>{{contact.email}}</td>
               <td>
                 <font-awesome-icon icon="fa-feather" size="1x" @click="passData(contact)"  class="text-primary cursor-pointer"/>
                 <font-awesome-icon icon=" fa-trash" size="1x" @click="deleteContact(contact._id)" class="text-danger cursor-pointer"  style="padding-left: 10px;" />
               </td>
             </tr>
             </tbody>
           </table>
        </div>
    </div>
  </section>
</template>

<script>


import {onMounted} from "vue";
import contacts from "@/modules/contacts";

document.title = 'Contact manager'


export default {
  name: 'HomeView',
  setup(){
    const {state,ContactList,ContactAdd,removeContact,updateContact} = contacts()


   const selectSingleContact = () => {
      if (state.value.contacts.length === state.value.cont.length){
        state.value.multipleSelect = true
      }
      else{
        state.value.multipleSelect = false
      }
   }

   const selectAllContact = () => {
       if (state.value.multipleSelect){
         state.value.cont = []
         for (var i = 0; i < state.value.contacts.length;i++){
           state.value.cont.push(state.value.contacts[i]._id)
         }
       }else{
         state.value.cont = []
       }
   }

    const deleteRecords = () =>{
       if ( state.value.cont.length > 0){
         deleteContact(state.value.cont)
       }
    }

    const onsubmit = (event) =>{
      if (state.value.updateId !== ""){
        editContact(event)
      }else{
        newContact(event)
      }
    }
    const newContact = (event) =>{
     state.value.btnLoading = true
        ContactAdd(state.value.form)
      event.target.reset();
    }
    const deleteContact = (id) =>{
      let confirmAction = confirm("Etes vous sûre de vouloir supprimer ce contact ?");

      let arrayId = []

      if (typeof  id == "object"){
        arrayId = id
      }else{
       arrayId.push(id)
      }
      if (confirmAction) {
        removeContact(arrayId)
      } else {
        console.log("annulé")
      }
    }
    const passData = (data) =>{
      state.value.form.firstname = data.firstname
      state.value.form.lastname = data.lastname
      state.value.form.phone = data.phone
      state.value.form.email = data.email
      state.value.updateId = data._id
    }
    const editContact = (event) =>{
      console.log(event)
       state.value.btnLoading = true
      updateContact(state.value.updateId,state.value.form)
      event.target.reset();
    }


    onMounted(()=>{
      ContactList()
    })

    return { state,
      onsubmit,
      ContactList,
      ContactAdd,
      newContact,
      deleteContact,
      passData,
      editContact,
      removeContact,selectAllContact,selectSingleContact,deleteRecords
    }
  },
  components: {
  }


}
</script>
