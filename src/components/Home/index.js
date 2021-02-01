import React, {Component} from 'react'
import firebase from '../../firebase'
import './home.css'

class Home extends Component {
    
    state = {
        posts: [],
        token: ''
    }

    componentDidMount()
    {
        firebase.app.ref('posts').on('value', (snapshot) => {
            let state = this.state
            state.posts = []
            snapshot.forEach(childItem => {
                state.posts.push({
                    key: childItem.key,
                    titulo: childItem.val().titulo,
                    imagem: childItem.val().imagem,
                    descricao: childItem.val().descricao,
                    autor: childItem.val().autor
                })
            });
            state.posts.reverse()
            this.setState(state)
        })

        firebase.app.ref('token').on('value', snapshot => {
            let state = this.state
            state.token = snapshot.val()
            this.setState(state)
        })
    }
    
    render()
    {
        return(
            <section id="post">
                {this.state.posts.map((post) => {
                    return(
                        <article key={post.key}>
                            <header>
                                <div className="title">
                                    <strong>{post.titulo}</strong>
                                    <span>Autor: {post.autor}</span>
                                </div>
                            </header>
                            <img src={post.imagem} alt="capa do post"/>
                            <footer>
                                <p>{post.descricao}</p>
                            </footer>
                        </article>
                    )
                })}
                <p>Token: {this.state.token}</p>
            </section>
        )
    }
}

export default Home