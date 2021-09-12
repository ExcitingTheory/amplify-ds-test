import Amplify, { AuthModeStrategyType, API, withSSRContext } from 'aws-amplify';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DeleteTodoInput, GetTodoQuery, ListTodosQuery } from '../../API'
import awsExports from '../../aws-exports'
import { deleteTodo } from '../../graphql/mutations'
import { getTodo, listTodos } from '../../graphql/queries'
import { GetStaticProps, GetStaticPaths } from 'next'
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api'
import styles from '../../styles/Home.module.css'
import { Todo } from '../../models'
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import React, { useState } from 'react';

// Amplify.configure({ ...awsExports, ssr: true })
Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH
  }
})

export default function TodoPage({ todo }: { todo: Todo }) {
  const router = useRouter()
  const [todoModel, setTodoModel] = useState(deserializeModel(Todo, todo));

  console.log('todo', todo)
  console.log('todoModel', todoModel)

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading&hellip;</h1>
      </div>
    )
  }
  async function handleDelete2(): Promise<void>  {
    const SSR = withSSRContext()
    try {
      const deleted = await SSR.DataStore.delete(todoModel);
      console.log('deleted', deleted)
      router.push(`/`)
    } catch ({ errors }) {
      console.error(...errors)
      throw new Error(errors[0].message)
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      const deleteInput: DeleteTodoInput = {
        id: todo.id,
        _version: todo._version
      }

      await API.graphql({
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        query: deleteTodo,
        variables: {
          input: deleteInput,
        },
      })

      router.push(`/`)
    } catch ({ errors }) {
      console.error(...errors)
      throw new Error(errors[0].message)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{todo.name} – Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href='/'>Home</a>
        <h1 className={styles.title}>{todo.name}</h1>
        <p className={styles.description}>{todo.description}</p>
      </main>

      <footer>
      <button className={styles.footer} onClick={handleDelete}>
          💥 Delete via Graphql
        </button>
        <button className={styles.footer} onClick={handleDelete2}>
          💥 Delete via DataStore
        </button>
      </footer>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext()

  const todos = await SSR.DataStore.query(Todo);

  const paths = todos.map((todo: Todo) => ({
    params: { id: todo.id },
  }))

  return {
    fallback: true,
    paths,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const SSR = withSSRContext()

  const todo = await SSR.DataStore.query(Todo, params.id);

  return {
    props: {
      todo: serializeModel(todo),
    },
  };
}
