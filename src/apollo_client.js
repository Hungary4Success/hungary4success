import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';

export default (ssrMode, headers, cache) => {
  return new ApolloClient({
    ssrMode,
    link: createHttpLink({
      uri: API_URL,
      credentials: 'same-origin',
      headers
    }),
    cache
  });
};
