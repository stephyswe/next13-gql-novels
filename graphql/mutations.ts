import { gql } from '@apollo/client'

export const ADD_NOVEL = gql`
  mutation AddNovel($image: String, $title: String) {
    addNovel(image: $image, title: $title) {
      authors {
        id
        name
        novelId
      }
      createdAt
      id
      image
      title
      updatedAt
    }
  }
`

export const ADD_AUTHOR = gql`
  mutation Mutation($novelId: ID!, $name: String) {
    addAuthor(novelId: $novelId, name: $name) {
      id
      name
      novelId
    }
  }
`