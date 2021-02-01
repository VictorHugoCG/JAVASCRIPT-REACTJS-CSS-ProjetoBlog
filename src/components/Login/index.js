import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import firebase from '../../firebase'
import './login.css'

class Login extends Component{
    constructor(props)
    {
        super(props)
        this.state = {
            email: '',
            password: ''
        }

        this.entrar=this.entrar.bind(this)
        this.login=this.login.bind(this)
    }

    componentDidMount()
    {
        //verificando se tem algum usuário logado
        if(firebase.getCurrent())
        {
            return this.props.history.replace('/dashboard')
        }
    }

    entrar(e)
    {

        this.login()

        e.preventDefault()
    }

    login = async () =>
    {
        const {email, password} = this.state

        try{

            await firebase.login(email,password)
            .catch((error) => {
                if(error.code === 'auth/user-not-found')
                {
                    alert('Usuário não existe!')
                }
                else
                {
                    alert('Código do erro: ' + error.code)
                    return null
                }
            })

            //após o login redirecionando para a página de dashboard
            this.props.history.replace('/dashboard')

        }catch(error){
            alert(error.message)
        }
    }
    
    render()
    {
        return(
            <div>
                <form onSubmit={this.entrar} id="login">
                    <label>Email:</label><br/>
                    <input type="text" autoComplete="off" autoFocus value={this.state.email} onChange={(e) => {this.setState({email: e.target.value})}} placeholder="teste@email.com"/><br/>
                    <label>Senha:</label><br/>
                    <input type="password" autoComplete="off" value={this.state.password} onChange={(e) => {this.setState({password: e.target.value})}} placeholder="Sua senha..."/><br/>
                    <button type="submit">Entrar</button>
                    <Link to="/register">Ainda não possui uma conta?</Link>
                </form>
            </div>
        )
    }
}

export default withRouter(Login)