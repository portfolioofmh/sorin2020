import gql from 'graphql-tag'

export default gql`
  query userQuery($UserId: Int!) {
      users(id:$UserId) {
        id
        data
      }
  }
`