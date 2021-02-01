import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import firebase from '../../firebase'
import './dashboard.css'

class Dashboard extends Component{
    constructor(props)
    {
        super(props)
        this.state = {
            nome: localStorage.nome
        }

        this.logout=this.logout.bind(this)
    }

    async componentDidMount()
    {
        if(!firebase.getCurrent())
        {
            this.props.history.replace('/login')
            return null
        }

        firebase.getUserName((info) => {
            localStorage.nome = info.val().nome
            this.setState({nome: localStorage.nome })
        })
    }

    logout = async() =>
    {
        await firebase.logout()
        .catch((error) => {
            console.log(error)
        })
        localStorage.removeItem("nome")
        this.props.history.replace('/')
    }

    render()
    {
        return(
            <div id="dashboard">
                <h1>Painel de Controle</h1>
                <div className="userInfo">
                    <h2>Olá {this.state.nome}</h2>
                    <Link to="/dashboard/new">Novo post</Link>
                </div>
                <p>Logado com {firebase.getCurrent()}</p>

                <button onClick={() => {this.logout()}}>Sair</button>
            </div>
        )
    }
}

export default withRouter(Dashboard)