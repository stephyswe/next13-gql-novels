'use client'
import React, { useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import { GET_NOVEL } from '@/graphql/queries'
import { ADD_AUTHOR } from '@/graphql/mutations'
import { INovel } from '@/typings'

type Props = {
  params: {
    id: string
  }
}

const Novel = ({ params: { id } }: Props) => {
  const [name, setName] = useState('')

  const { data, loading, error } = useQuery(GET_NOVEL, {
    variables: { id },
  })
  const [addAuthor] = useMutation(ADD_AUTHOR, {
    variables: { novelId: id, name },
    refetchQueries: [{ query: GET_NOVEL, variables: { id } }],
  })

  const novel: INovel = data?.novel

  const handleAddAuthor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name === '') return alert('Please enter author name')
    addAuthor({ variables: { novelId: id, name } })
    setName('')
  }

  if (loading)
    return (
      <p className="text-white flex items-center justify-center">
        Loading ....
      </p>
    )
  if (error)
    return (
      <p className="text-white flex items-center justify-center">
        Oops! Something went wrong ....
      </p>
    )
  return (
    <article className=" text-white">
      <section className="flex gap-2 ">
        {novel.image && (
          <img height={200} width={200} src={novel.image} alt="" />
        )}

        <div className="p-2 flex flex-col">
          <h1 className="text-4xl ">Title : {novel.title}</h1>

          <div className="flex items-center gap-2">
            {novel?.authors?.map((author) => (
              <h2 key={author.id} className="font-bold">
                {author.name}
              </h2>
            ))}
          </div>
          <p className="text-slate-400 ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Architecto cum nam sed voluptates sunt aliquid nemo maxime
            itaque tempora, autem alias nostrum molestiae deserunt earum
            animi numquam reprehenderit laboriosam libero? Quas, atque
            totam vero nostrum dolore, nihil autem neque architecto
            deserunt illo itaque, ab quae ipsam corrupti ipsum quaerat? Sed
            hic ipsum excepturi earum minus consectetur soluta totam
            temporibus libero.
          </p>
          <form onSubmit={handleAddAuthor} className="mt-5 space-x-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter Author"
              className="bg-transparent border p-2 mx-2"
            />
            <button
              disabled={!name}
              className="border p-2 rounded-lg disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Add Author
            </button>
          </form>
        </div>
      </section>
    </article>
  )
}

export default Novel