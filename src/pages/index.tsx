import { AmplifyAuthenticator } from '@aws-amplify/ui-react'
import Amplify, { AuthModeStrategyType, API, Auth, withSSRContext } from 'aws-amplify';
import Head from 'next/head'
import awsExports from '../aws-exports'
import { createTodo } from '../graphql/mutations'
import { listTodos } from '../graphql/queries'
import {
  CreateTodoInput,
  CreateTodoMutation,
  ListTodosQuery,
  // Todo,
} from '../API'
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import styles from '../styles/Home.module.css'

import { serializeModel } from '@aws-amplify/datastore/ssr';
import { 
  Todo
} from "../models";


// Amplify.configure({ ...awsExports, ssr: true })
Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH
  }
})

export default function Home({ todos = [] }: { todos: Todo[] }) {
  const router = useRouter()

  async function handleCreateTodo2(event) {
    event.preventDefault()
    const SSR = withSSRContext()
    const form = new FormData(event.target)

    try {
      const newTodo = await SSR.DataStore.save(
        new Todo({
          name: form.get('title').toString(),
          description: form.get('content').toString()
        })
      );
      console.log('newTodo', newTodo)
      // router.push(`/todo/${newTodo.id}`)
    } catch ({ errors }) {
      console.error(...errors)
      throw new Error(errors[0].message)
    }
  }

  async function handleCreateTodo(event) {
    event.preventDefault()

    const form = new FormData(event.target)

    try {
      const createInput: CreateTodoInput = {
        name: form.get('title').toString(),
        description: form.get('content').toString(),
      }

      const request = (await API.graphql({
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        query: createTodo,
        variables: {
          input: createInput,
        },
      })) as { data: CreateTodoMutation; errors: any[] }

      router.push(`/todo/${request.data.createTodo.id}`)
    } catch ({ errors }) {
      console.error(...errors)
      throw new Error(errors[0].message)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Amplify + Next.js</h1>

        <p className={styles.description}>
          <code className={styles.code}>{todos.length}</code>
          Todos
        </p>

        <div className={styles.grid}>
          {todos.map((todo) => (
            <a href={`/todo/${todo.id}`} key={todo.id}>
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>
            </a>
          ))}

          <div className={styles.card}>
            <h3 className={styles.title}>New Todo</h3>

            <AmplifyAuthenticator>
              <form onSubmit={handleCreateTodo}>
                <fieldset>
                  <legend>Title</legend>
                  <input
                    defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                    name="title"
                  />
                </fieldset>

                <fieldset>
                  <legend>Content</legend>
                  <textarea
                    defaultValue="I built an Amplify app with Next.js!"
                    name="content"
                  />
                </fieldset>

                <button>Create Todo via Graphql</button>
                <button type="button" onClick={() => Auth.signOut()}>
                  Sign out
                </button>
              </form>



              <form onSubmit={handleCreateTodo2}>
                <fieldset>
                  <legend>Title</legend>
                  <input
                    defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                    name="title"
                  />
                </fieldset>

                <fieldset>
                  <legend>Content</legend>
                  <textarea
                    defaultValue="I built an Amplify app with Next.js!"
                    name="content"
                  />
                </fieldset>

                <button>Create Todo via DataStore</button>
                <button type="button" onClick={() => Auth.signOut()}>
                  Sign out
                </button>
              </form>


            </AmplifyAuthenticator>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const SSR = withSSRContext({ req })
  const todos = await SSR.DataStore.query(Todo);

  return {
    props: {
      todos: serializeModel(todos),
    },
  };

}


