import { useInfiniteQuery } from '@tanstack/react-query';
import { Issue, State } from '../interfaces';
import { sleep } from '../../helpers';
import { githubApi } from '../../api/githubApi';

interface Props {
  labels: string[];
  page?: number;
  state?: State;
}

interface queryProps {
  pageParam?: number;
  queryKey: (string | Props)[];
}

const getIssues = async ({
  pageParam = 1,
  queryKey,
}: queryProps): Promise<Issue[]> => {
  const [, , args] = queryKey;

  const { state, labels } = args as Props;

  const params = new URLSearchParams();

  if (state) params.append('state', state);

  if (labels.length > 0) {
    const labelString = labels.join(',');
    params.append('labels', labelString);
  }

  params.append('page', pageParam.toString());

  params.append('per_page', '5');

  const { data } = await githubApi.get<Issue[]>('/issues', { params });

  return data;
};

export const useIssuesInfinite = ({ state, labels }: Props) => {
  const issuesQuery = useInfiniteQuery({
    initialPageParam: 1,

    queryKey: ['issues', 'infinite', { state, labels }],

    queryFn: ({ pageParam, queryKey }) => getIssues({ pageParam, queryKey }),

    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 5 || lastPage.length === 0) return;

      return pages.length + 1;
    },
  });

  return {
    issuesQuery,
  };
};

//! El hook useInfiniteQuery recibe un objeto el cual tiene las siguientes propiedades:

//* initialPageParam - REQUERIDA - El parámetro de la página por defecto cuando se llame la primera página.

//* queryFn - REQUERIDA - La función que se invocará para pedir la data.
//* En el argumento del queryFn viene la DATA de la cual puedo desestructurar:
//* pageParam
//* queryKey
//* direction
//* metal
//* signal

//* getNextPageParam - REQUERIDA - Cuando se reciben nuevos datos para esta consulta, esta función recibe tanto la última página de la lista infinita de datos como el arreglo completo de todas las páginas, así como la información de pageParam.

//? getPreviousPageParam - Cuando se reciben nuevos datos para esta consulta, esta función recibe tanto la última página de la lista infinita de datos como el arreglo completo de todas las páginas, así como la información de pageParam.

//? maxPages - El número máximo de páginas para almacenar en los datos de la consulta infinita.

//? queryKey - El nombre del espacio en cache en donde se almacenará la data de la consulta.
