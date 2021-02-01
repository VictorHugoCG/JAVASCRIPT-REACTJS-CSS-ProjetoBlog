import React, {Component} from 'react'
import {withRouter, } from 'react-router-dom'
import firebase from '../../firebase'
import './register.css'

class Register extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            nome: '',
            email: '',
            senha: ''
        }

        this.register=this.register.bind(this)
        this.onRegister=this.onRegister.bind(this)
    }

    register(e)
    {

        this.onRegister()

        e.preventDefault()
    }

    onRegister = async() =>
    {
        try{
            const {nome, email, senha} = this.state

            await firebase.register(nome, email, senha)
            .catch((error) => {
                alert("Código do erro: " + error.code)
            })

            this.props.history.replace('/dashboard')

        }catch(error)
        {
            alert(error.message)
        }
    }

    render()
    {
        return(
            <div>
                <h1 className="registerH1">Novo usuário</h1>
                
                <form onSubmit={this.register} id="register">
                    <label>Nome:</label>
                    <input type="text" value={this.state.nome} onChange={(e) => {this.setState({nome: e.target.value})}} autoFocus autoComplete="off" placeholder="Seu nome..."/>
                    <label>Email:</label>
                    <input type="email" value={this.state.email} onChange={(e) => {this.setState({email: e.target.value})}} autoComplete="off" placeholder="teste@email.com"/>
                    <label>Senha:</label>
                    <input type="password" value={this.state.senha} onChange={(e) => {this.setState({senha: e.target.value})}}autoComplete="off" placeholder="123456"/>

                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        )
    }
}

export default withRouter(Register)