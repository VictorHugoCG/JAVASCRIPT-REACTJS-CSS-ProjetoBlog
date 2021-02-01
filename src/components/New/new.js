import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import firebase from '../../firebase'
import './new.css'


class New extends Component{
    constructor(props)
    {
        super(props)
        this.state = {
            titulo: '',
            imagem: null,
            url: '',
            descricao: '',
            alert: '',
            progress: 0
        }

        this.cadastrar=this.cadastrar.bind(this)
        this.newPost=this.newPost.bind(this)
        this.handleFile=this.handleFile.bind(this)
        this.handleUpload=this.handleUpload.bind(this)
    }

    componentDidMount()
    {
        if(!firebase.getCurrent)
        {
            this.props.history.replace('/')
            return null
        }
    }

    cadastrar(e)
    {
        
        this.newPost()
        
        e.preventDefault()
    }

    newPost = async() =>
    {
        try{
            if(this.state.titulo !== '' && this.state.imagem !== null && this.state.descricao !== '' && this.state.url !== '')
            {
                const {titulo,url,descricao} = this.state

                await firebase.newPost(titulo,url,descricao)
                .catch((error) => {
                    alert("Código do erro: " + error.code)
                })

                this.props.history.replace('/dashboard')
            }
            else
            {
                this.setState({alert: 'Preencha todos os campos!'})
            }

        }catch(error)
        {
            alert(error.message)
        }
    }

    handleFile = async(e) =>
    {
        if(e.target.files[0])
        {
            const image = e.target.files[0]

            if(image.type === 'image/png' || image.type === 'image/jpeg')
            {
                await this.setState({imagem: image})
                this.handleUpload()
            }
            else{
                alert("Envie uma imagem do tipo PNG ou JPG")
                this.setState({imagem: null})
                return null
            }

            
        }
        
        
    }

    handleUpload = async() =>
    {
        const {imagem} = this.state
        const currentUid = firebase.getCurrentUid()
        const uploadTaks = firebase.storage.ref(`images/${currentUid}/${imagem.name}`).put(imagem)

        await uploadTaks.on('state_changed', (snapshot) => {
            //progresso
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            this.setState({progress: progress})
        },
        (error) => {
            //error
            console.log('Error imagem' + error)
        },
        () => {
            //sucesso
            firebase.storage.ref(`images/${currentUid}`).child(imagem.name)
            .getDownloadURL().then((url) => {
                this.setState({url: url})
                console.log(this.state.url)
            })
            
        })
    }
    
    render()
    {
        return(
            <div>
                <header id="new">
                    <Link to="/dashboard">Voltar</Link>
                </header>

                <form onSubmit={this.cadastrar} id="newPost">
                    <span>{this.state.alert}</span>
                    <input type="file" onChange={this.handleFile}/>
                    {this.state.url !== '' ?
                        <img src={this.state.url} alt="Capa do post"/>
                        :
                        <progress value={this.state.progress} max="100"/>
                    }
                    <label>Título</label>
                    <input type="text" placeholder="Título do post..." value={this.state.titulo} onChange={(e) => {this.setState({titulo: e.target.value})}} autoFocus/>
                    <label>Descrição</label>
                    <textarea type="text" placeholder="Descrição do post..." value={this.state.descricao} onChange={(e) => {this.setState({descricao: e.target.value})}}/>
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        )
    }
}

export default withRouter(New)