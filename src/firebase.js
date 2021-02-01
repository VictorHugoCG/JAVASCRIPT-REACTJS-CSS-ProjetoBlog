import app from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

let firebaseConfig = {
    apiKey: "AIzaSyDiHhBtyZzaXTslodDlecr83biikaN6BJ8",
    authDomain: "teste-f6d56.firebaseapp.com",
    databaseURL: "https://teste-f6d56-default-rtdb.firebaseio.com",
    projectId: "teste-f6d56",
    storageBucket: "teste-f6d56.appspot.com",
    messagingSenderId: "968841730863",
    appId: "1:968841730863:web:3d905449411a1f3b605fda"
  };

class Firebase {
    constructor()
    {
        // Initialize Firebase
        if (!app.apps.length) {app.initializeApp(firebaseConfig);}

       //Referenciando a databse para acessar em outros locais
        this.app = app.database()

        //Referenciando o storage para acessar em outros locais
        this.storage = app.storage()
    }

    login(email, password)
    {
        return app.auth().signInWithEmailAndPassword(email, password)
    }

    logout()
    {
        return app.auth().signOut()
    }

    async register(name,email,password)
    {
        await app.auth().createUserWithEmailAndPassword(email,password)

        const uid = app.auth().currentUser.uid

        return app.database().ref('usuarios').child(uid).set({
            nome: name,
            email: email,
            senha: password
        })
    }

    async newPost(titulo,url,descricao)
    {
        let posts = app.database().ref('posts')
        let chave = posts.push().key
        await posts.child(chave).set({
            titulo: titulo,
            imagem: url,
            descricao: descricao,
            autor: localStorage.nome
        })

    }

    isInitialized()
    {
        return new Promise((resolve) => {
            app.auth().onAuthStateChanged(resolve)
        })
    }

    getCurrent()
    {
        return app.auth().currentUser && app.auth().currentUser.email
    }

    getCurrentUid()
    {
        return app.auth().currentUser && app.auth().currentUser.uid
    }

    async getUserName(callback)
    {
        if(!app.auth().currentUser){
            return null
        }
        
        const uid = app.auth().currentUser.uid

        await app.database().ref('usuarios').child(uid).once('value').then(callback)
    }

    
}

export default new Firebase()